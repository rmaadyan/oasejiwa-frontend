"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { faqs } from "@/lib/data";

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <motion.section 
      id="faq" 
      className="bg-[#F5FBFF] py-16" 
      data-component="FAQSection"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-6xl px-2 sm:px-3 lg:px-4">
        <h2 className="text-center text-4xl font-semibold text-primary-text md:text-5xl">
          FAQ
        </h2>

        <div className="mt-10 space-y-4">
          {faqs.map((f) => {
            const isOpen = openId === f.id;

            return (
              <div key={f.id} className="rounded-2xl bg-[#D1EAFF] border border-[#D1EAFF]/30">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                  className="flex w-full items-center justify-between gap-4 px-8 py-6 text-left"
                >
                  <span className="text-[15px] font-semibold text-[#2B5379] md:text-base">
                    {f.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-700 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Ini sengaja dibuat tidak render sama sekali kalau closed */}
                {isOpen ? (
                  <div className="px-8 pb-6">
                    <p className="text-sm leading-relaxed text-slate-700">
                      {f.answer}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
