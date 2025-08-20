'use client'
import { useState, useEffect } from "react";
import templates from "./templates";
import { supabase } from "@/lib/supabase";

export default function BusinessPage(props) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slug, setSlug] = useState(null);
  const [templateId, setTemplateId] = useState(1);

  useEffect(() => {
    async function getParams() {
      try {
        const params = await props.params;
        const searchParams = await props.searchParams;
        
        setSlug(params.slug);
        const templateFromQuery = parseInt(searchParams.template);
        setTemplateId(templateFromQuery || 1);
      } catch (err) {
        setError("Failed to load page parameters");
        setLoading(false);
      }
    }
    
    getParams();
  }, [props.params, props.searchParams]);

  useEffect(() => {
    async function fetchBusinessData() {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { data: businessData, error: fetchError } = await supabase
          .from("businesses")
          .select("*")
          .eq("slug", slug)
          .single();

        if (fetchError || !businessData) {
          setError("Business not found");
          return;
        }

        setBusiness(businessData);
        // Use template from business data if no query template specified
        if (!templateId || templateId === 1) {
          setTemplateId(businessData.template_id || 1);
        }
      } catch (err) {
        setError("Failed to fetch business data");
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessData();
  }, [slug, templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Business not found</div>
      </div>
    );
  }

  const Template = templates[templateId];

  if (!Template) {
    return (
      <div className="p-4 text-red-500 text-center">
        <h2 className="text-xl font-bold mb-2">Template not found</h2>
        <p>Template ID {templateId} is not available.</p>
      </div>
    );
  }

  return (
    <Template 
      business={business} 
      setBusiness={setBusiness}
      onBusinessUpdate={(updatedBusiness) => setBusiness(updatedBusiness)}
    />
  );
}