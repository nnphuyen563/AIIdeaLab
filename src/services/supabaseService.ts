import { createClient } from '@supabase/supabase-js';
import { CanvasScreen } from './aiService';

export interface UserDesign {
  id: string;
  user_id: string;
  title: string;
  design_md?: string;
  design_system?: {
    tokens: string[];
    cssVariables?: string;
    primaryAccent?: string;
    baseBg?: string;
    fontStack?: string;
    presetName?: string;
  };
  preset_id?: string;
  screens: CanvasScreen[];
  created_at: number;
  updated_at: number;
}

// Retrieve credentials with multiple fallback aliases
const getSupabaseCredentials = () => {
  const metaEnv = (import.meta as any).env || {};
  const url = (metaEnv.VITE_SUPABASE_URL as string) || 
    (metaEnv.SUPABASE_URL as string) || 
    'https://pdvnclyhfvvejhcoalcq.supabase.co';
    
  const key = (metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY as string) || 
    (metaEnv.SUPABASE_PUBLISHABLE_KEY as string) || 
    'sb_publishable_pdfSY1mxI0o0o0bI0Lk5jQ___G5ZKic';

  return { url: url.trim(), key: key.trim() };
};

const creds = getSupabaseCredentials();

export const supabase = createClient(creds.url, creds.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

const USER_STORAGE_KEY = 'stitch_active_user_id';
const LOCAL_LOCKER_KEY = 'stitch_local_design_locker';
const AUTH_USER_KEY = 'stitch_authenticated_user';
const REGISTERED_USERS_KEY = 'stitch_registered_users_registry';

export interface AuthUser {
  id: string;
  handle: string;
  email?: string;
  created_at: number;
}

/**
 * Check if the user is currently authenticated / logged in
 */
export const isUserAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return false;
  try {
    const user = JSON.parse(raw);
    return Boolean(user && user.id);
  } catch {
    return false;
  }
};

/**
 * Get current authenticated user details
 */
export const getCurrentAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

/**
 * Log in a user with identifier and password
 */
export const loginUser = async (
  identifier: string,
  password?: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  const cleanId = identifier.trim();
  if (!cleanId) {
    return { success: false, error: 'Vui lòng nhập tên người dùng hoặc email.' };
  }

  // 1. Try Supabase Auth if email format
  if (cleanId.includes('@') && password && password.length >= 6) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanId,
        password: password
      });

      if (!error && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          handle: data.user.user_metadata?.handle || cleanId.split('@')[0],
          email: data.user.email,
          created_at: new Date(data.user.created_at).getTime()
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        localStorage.setItem(USER_STORAGE_KEY, authUser.id);
        return { success: true, user: authUser };
      }
    } catch (err: any) {
      console.warn('Supabase auth sign-in warning:', err);
    }
  }

  // 2. Check local registered users registry
  try {
    const rawRegistry = localStorage.getItem(REGISTERED_USERS_KEY);
    const registry: (AuthUser & { passwordHash?: string })[] = rawRegistry ? JSON.parse(rawRegistry) : [];
    
    const matched = registry.find(u => 
      u.handle.toLowerCase() === cleanId.toLowerCase() || 
      (u.email && u.email.toLowerCase() === cleanId.toLowerCase())
    );

    if (matched) {
      if (password && matched.passwordHash && matched.passwordHash !== password) {
        return { success: false, error: 'Mật mã không chính xác. Vui lòng kiểm tra lại.' };
      }

      const authUser: AuthUser = {
        id: matched.id,
        handle: matched.handle,
        email: matched.email,
        created_at: matched.created_at
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      localStorage.setItem(USER_STORAGE_KEY, authUser.id);
      return { success: true, user: authUser };
    }
  } catch (err) {
    console.warn('Registry lookup error:', err);
  }

  return { 
    success: false, 
    error: 'Không tìm thấy tài khoản. Bạn chưa đăng ký Locker? Hãy chuyển sang tab Đăng ký.' 
  };
};

/**
 * Register a new user and initialize their private Locker
 */
export const registerUser = async (
  handle: string,
  email: string,
  password?: string,
  forceLocal: boolean = false
): Promise<{ success: boolean; user?: AuthUser; error?: string; isRateLimit?: boolean }> => {
  const cleanHandle = handle.trim().replace(/\s+/g, '_');
  const cleanEmail = email.trim();

  if (!cleanHandle) {
    return { success: false, error: 'Vui lòng nhập tên người dùng / bí danh.' };
  }

  // Generate unique User ID
  const newUserId = `usr_${cleanHandle.toLowerCase()}_${Math.random().toString(36).substring(2, 6)}`;

  // 1. If email is provided and not forcing local, register directly in Supabase Cloud Auth
  if (cleanEmail && !forceLocal) {
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Email không đúng định dạng. Vui lòng nhập email hợp lệ (ví dụ: designer@gmail.com).' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Mật khẩu bảo vệ tài khoản Supabase yêu cầu tối thiểu 6 ký tự.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: { handle: cleanHandle }
        }
      });

      if (error) {
        const isRateLimit = error.message?.toLowerCase().includes('rate limit') || 
                            (error as any).status === 429;
        
        if (isRateLimit) {
          return { 
            success: false, 
            isRateLimit: true,
            error: 'RATE_LIMIT: Supabase giới hạn 3-4 email xác nhận/giờ trên máy chủ dùng chung. Để khắc phục: Vào Supabase Dashboard > Authentication > Providers > Email và TẮT (Disable) "Confirm email" để tạo tài khoản tức thì.' 
          };
        }

        if (error.message?.toLowerCase().includes('already registered')) {
          return {
            success: false,
            error: 'Email này đã được đăng ký trong Supabase. Hãy chuyển sang tab Đăng nhập để truy cập Locker.'
          };
        }

        return { success: false, error: `Lỗi Supabase Auth: ${error.message}` };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          handle: cleanHandle,
          email: cleanEmail,
          created_at: Date.now()
        };

        // Also attempt to mirror profile in public.user_profiles table
        try {
          await supabase.from('user_profiles').upsert({
            id: data.user.id,
            handle: cleanHandle,
            email: cleanEmail,
            created_at: Date.now()
          });
        } catch {
          // Table might not exist yet if schema has not been run
        }

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        localStorage.setItem(USER_STORAGE_KEY, authUser.id);
        return { success: true, user: authUser };
      }
    } catch (err: any) {
      return { success: false, error: `Không thể kết nối đến máy chủ Supabase: ${err.message || 'Lỗi mạng'}` };
    }
  }

  // 2. Local & Table Registry fallback
  const authUser: AuthUser = {
    id: newUserId,
    handle: cleanHandle,
    email: cleanEmail || undefined,
    created_at: Date.now()
  };

  try {
    const rawRegistry = localStorage.getItem(REGISTERED_USERS_KEY);
    const registry: (AuthUser & { passwordHash?: string })[] = rawRegistry ? JSON.parse(rawRegistry) : [];
    
    // Check if handle already exists
    if (registry.some(u => u.handle.toLowerCase() === cleanHandle.toLowerCase())) {
      return { success: false, error: `Tên "${cleanHandle}" đã tồn tại. Vui lòng chọn tên khác hoặc Đăng nhập.` };
    }

    registry.push({
      ...authUser,
      passwordHash: password || undefined
    });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registry));
  } catch (err) {
    console.warn('Failed to update registry:', err);
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  localStorage.setItem(USER_STORAGE_KEY, authUser.id);

  return { success: true, user: authUser };
};

/**
 * Quick Guest Pass for instant testing without friction
 */
export const quickGuestPass = (): AuthUser => {
  const guestUser: AuthUser = {
    id: `guest_${Math.random().toString(36).substring(2, 8)}`,
    handle: `Khách_${Math.floor(1000 + Math.random() * 9000)}`,
    created_at: Date.now()
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(guestUser));
  localStorage.setItem(USER_STORAGE_KEY, guestUser.id);
  return guestUser;
};

/**
 * Log out user and clear session
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignore error
  }
  localStorage.removeItem(AUTH_USER_KEY);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('stitch-auth-logout'));
  }
};

/**
 * Get current active user ID (or generate a persistent anonymous ID)
 */
export const getCurrentUserId = (): string => {
  if (typeof window === 'undefined') return 'user_default';
  
  // Prefer authenticated user
  const auth = getCurrentAuthUser();
  if (auth && auth.id) return auth.id;

  let userId = localStorage.getItem(USER_STORAGE_KEY);
  if (!userId || !userId.trim()) {
    userId = `designer_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(USER_STORAGE_KEY, userId);
  }
  return userId;
};

/**
 * Switch or set user ID to access their own private design locker
 */
export const setCurrentUserId = (userId: string): void => {
  if (typeof window === 'undefined') return;
  const clean = userId.trim() || `designer_${Math.random().toString(36).substring(2, 8)}`;
  localStorage.setItem(USER_STORAGE_KEY, clean);
};

/**
 * LocalStorage fallback helpers for reliable offline persistence
 */
const getLocalLocker = (userId: string): UserDesign[] => {
  try {
    const raw = localStorage.getItem(`${LOCAL_LOCKER_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalLocker = (userId: string, designs: UserDesign[]): void => {
  try {
    localStorage.setItem(`${LOCAL_LOCKER_KEY}_${userId}`, JSON.stringify(designs));
  } catch (err) {
    console.warn('Failed to save to local locker:', err);
  }
};

/**
 * Save / Update a design in Supabase locker
 * All HTML is stored inside the database and queried dynamically
 */
export const saveDesignToLocker = async (
  design: Omit<UserDesign, 'user_id' | 'updated_at'> & { user_id?: string }
): Promise<{ success: boolean; id: string; error?: string }> => {
  const userId = design.user_id || getCurrentUserId();
  const timestamp = Date.now();

  const record: UserDesign = {
    ...design,
    user_id: userId,
    updated_at: timestamp,
    created_at: design.created_at || timestamp
  };

  // 1. Mirror to local locker first for zero-latency instant access
  const localList = getLocalLocker(userId);
  const existingIdx = localList.findIndex(d => d.id === record.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = record;
  } else {
    localList.unshift(record);
  }
  saveLocalLocker(userId, localList);

  // 2. Persist to Supabase Database
  try {
    const { error } = await supabase
      .from('user_designs')
      .upsert({
        id: record.id,
        user_id: record.user_id,
        title: record.title,
        design_md: record.design_md || '',
        design_system: record.design_system || {},
        preset_id: record.preset_id || 'alexandria',
        screens: record.screens || [],
        created_at: record.created_at,
        updated_at: record.updated_at
      });

    if (error) {
      console.warn('Supabase upsert warning (table might require creation):', error.message);
      return { success: true, id: record.id, error: error.message };
    }

    return { success: true, id: record.id };
  } catch (err: any) {
    console.warn('Supabase network error, stored locally in locker:', err);
    return { success: true, id: record.id, error: err.message };
  }
};

/**
 * Load all designs belonging to the user from Supabase locker
 */
export const loadUserLocker = async (userId?: string): Promise<UserDesign[]> => {
  const activeUser = userId || getCurrentUserId();

  try {
    const { data, error } = await supabase
      .from('user_designs')
      .select('*')
      .eq('user_id', activeUser)
      .order('updated_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // Sync local locker with remote
      saveLocalLocker(activeUser, data as UserDesign[]);
      return data as UserDesign[];
    }
  } catch (err) {
    console.warn('Failed to query Supabase locker, using local locker:', err);
  }

  // Fallback to local locker
  return getLocalLocker(activeUser);
};

/**
 * Query specific HTML for a screen and variant from the database
 */
export const queryHtmlFromDb = async (
  designId: string, 
  screenId?: string, 
  variantId?: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_designs')
      .select('screens')
      .eq('id', designId)
      .single();

    if (!error && data && data.screens && Array.isArray(data.screens)) {
      const screens = data.screens as CanvasScreen[];
      const targetScreen = screenId ? screens.find(s => s.id === screenId) : screens[0];
      if (targetScreen) {
        const targetVariant = variantId 
          ? targetScreen.variants.find(v => v.id === variantId)
          : targetScreen.variants.find(v => v.id === targetScreen.activeVariantId) || targetScreen.variants[0];
        if (targetVariant) {
          return targetVariant.htmlContent;
        }
      }
    }
  } catch (err) {
    console.warn('Error querying HTML from DB:', err);
  }

  // Fallback to local cache
  const userId = getCurrentUserId();
  const localList = getLocalLocker(userId);
  const localDesign = localList.find(d => d.id === designId);
  if (localDesign && localDesign.screens.length > 0) {
    const targetScreen = screenId ? localDesign.screens.find(s => s.id === screenId) : localDesign.screens[0];
    if (targetScreen) {
      const targetVariant = variantId 
        ? targetScreen.variants.find(v => v.id === variantId)
        : targetScreen.variants.find(v => v.id === targetScreen.activeVariantId) || targetScreen.variants[0];
      if (targetVariant) return targetVariant.htmlContent;
    }
  }

  return null;
};

/**
 * Delete a design from the user's locker
 */
export const deleteDesignFromLocker = async (designId: string): Promise<boolean> => {
  const userId = getCurrentUserId();

  // Remove locally
  const localList = getLocalLocker(userId).filter(d => d.id !== designId);
  saveLocalLocker(userId, localList);

  try {
    const { error } = await supabase
      .from('user_designs')
      .delete()
      .eq('id', designId)
      .eq('user_id', userId);

    return !error;
  } catch {
    return true;
  }
};

/**
 * Check whether the Supabase table 'user_designs' is created and accessible
 */
export const checkSupabaseTableStatus = async (): Promise<{
  connected: boolean;
  tableExists: boolean;
  message?: string;
  url: string;
}> => {
  const { url } = getSupabaseCredentials();
  try {
    const { error } = await supabase.from('user_designs').select('id').limit(1);
    if (!error) {
      return { connected: true, tableExists: true, url };
    }
    return {
      connected: true,
      tableExists: false,
      message: error.message,
      url
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: err?.message || 'Network error',
      url
    };
  }
};
