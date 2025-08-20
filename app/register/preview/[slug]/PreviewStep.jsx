"use client";

import { useState, Fragment } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const templates = [
  { id: 1, name: "Template 1" },
  { id: 2, name: "Template 2" },
  { id: 3, name: "Template 3" },
];

export default function PreviewWithTemplateStep({ slug, onNext }) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [loading, setLoading] = useState(false);

  const handleConfirmTemplate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("businesses")
      .update({ template_id: selectedTemplate.id })
      .eq("slug", slug);

    if (error) {
      toast.error("❌ Failed to save template. Please try again.");
      setLoading(false);
      return;
    }

    toast.success("✅ Template saved successfully!");
    onNext();
  };

  return (
    <div className="space-y-10 w-full max-w-2xl mx-auto">
      {/* 🔽 Dropdown Select */}
      <Listbox value={selectedTemplate} onChange={setSelectedTemplate}>
        <div className="relative mt-2">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <span className="block truncate">{selectedTemplate.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5">
              {templates.map((template) => (
                <Listbox.Option
                  key={template.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-emerald-100 text-emerald-700" : "text-gray-900"
                    }`
                  }
                  value={template}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {template.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-2 flex items-center text-emerald-600">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {/* 🔍 Live Preview */}
      <div className="rounded-xl overflow-hidden border shadow mb-6">
        <iframe
          src={`/site/${slug}?template=${selectedTemplate.id}`}
          className="w-full h-[550px] border-none"
          title="Live Site Preview"
        />
      </div>

      {/* ✅ Confirm Button */}
      <div className="flex justify-end">
        <button
          onClick={handleConfirmTemplate}
          disabled={loading}
          className={`px-6 py-2 rounded font-semibold transition text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {loading ? "Saving..." : "Looks Good! Setup Admin →"}
        </button>
      </div>
    </div>
  );
}
