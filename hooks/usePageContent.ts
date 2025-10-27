"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getPageContent, getPagesList } from "@/services/pages";
import { PageField } from "@/types/pages";

type FieldMap = Record<string, { en: string | null; pt: string | null }>;

function buildFieldMap(fields: PageField[]): FieldMap {
  return fields.reduce<FieldMap>((acc, field) => {
    acc[field.key] = { en: field.en, pt: field.pt };
    return acc;
  }, {} as FieldMap);
}

export function usePageContent(pageNameOrSlug: string) {
  const searchParams = useSearchParams();

  // Get locale from localStorage or default to "en"
  const getLocale = () => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = window.localStorage.getItem("lang");
      if (stored === "pt" || stored === "en") return stored;
    } catch {}
    return "en";
  };

  const locale = getLocale();
  const langParamRaw = (searchParams?.get("lang") || "").toLowerCase();
  const langFromParam = langParamRaw.startsWith("pt")
    ? "pt"
    : langParamRaw.startsWith("en")
    ? "en"
    : undefined;
  const lang =
    langFromParam ?? (locale.toLowerCase().startsWith("pt") ? "pt" : "en");

  const query = useQuery({
    queryKey: ["page-content", pageNameOrSlug, lang],
    queryFn: () => getPageContent(pageNameOrSlug, lang),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  const fieldsMap = useMemo<FieldMap>(() => {
    if (!query.data?.data?.fields) return {};
    return buildFieldMap(query.data.data.fields);
  }, [query.data]);

  const text = (key: string, fallback?: string): string => {
    const record = fieldsMap[key];
    if (!record) return fallback ?? key;
    const isPt = lang === "pt";
    const value = isPt ? record.pt ?? record.en : record.en ?? record.pt;
    return value ?? fallback ?? key;
  };

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as unknown,
    data: query.data,
    fieldsMap,
    text,
    refetch: query.refetch,
  };
}

export function useHomepageContent() {
  // new route expects "home"; legacy expects "homepage" – service handles fallback
  return usePageContent("homepage");
}

export function usePagesList(searchQuery?: string) {
  const query = useQuery({
    queryKey: ["pages-list", searchQuery],
    queryFn: () => getPagesList(searchQuery),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as unknown,
    data: query.data,
    pages: query.data?.data?.pages || [],
  };
}


