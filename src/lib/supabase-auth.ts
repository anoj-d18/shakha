import { supabase } from "@/integrations/supabase/client";

export const adminSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  
  // Check if user has admin role
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError) throw roleError;
  if (!roleData) throw new Error("You are not an admin");
  
  return data;
};

export const adminSignUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  
  // Assign admin role
  if (data.user) {
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: "admin" as any });
    if (roleError) throw roleError;
  }
  
  return data;
};

export const adminSignOut = async () => {
  await supabase.auth.signOut();
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const isAdmin = async (userId: string) => {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
};
