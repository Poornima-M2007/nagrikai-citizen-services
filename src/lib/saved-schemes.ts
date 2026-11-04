import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

// Saved schemes are stored per account in the saved_schemes table (RLS: own rows only).
export function useSavedSchemes() {
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const key = ["saved-schemes", user?.id];

  const query = useQuery({
    queryKey: key,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_schemes").select("scheme_id").order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((r) => r.scheme_id);
    },
  });
  const ids = query.data ?? [];

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Please log in to save schemes.");
      if (ids.includes(id)) {
        const { error } = await supabase.from("saved_schemes").delete().eq("scheme_id", id);
        if (error) throw error;
        return false;
      }
      const { error } = await supabase.from("saved_schemes").insert({ user_id: user.id, scheme_id: id });
      if (error) throw error;
      return true;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    ids,
    signedIn: !!user,
    loading: authLoading || (!!user && query.isLoading),
    error: query.error as Error | null,
    pending: mutation.isPending,
    toggle: (id: string) => mutation.mutateAsync(id),
    isSaved: (id: string) => ids.includes(id),
  };
}
