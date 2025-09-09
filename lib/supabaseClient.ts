"use client";
import { createClient } from '@supabase/supabase-js';

// 使用預設占位避免在建置階段拋錯（實際執行需在環境變數提供正確值）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
