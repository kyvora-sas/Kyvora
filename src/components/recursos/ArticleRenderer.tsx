import Image from "next/image";
import { AlertTriangle, CheckCircle2, Code2, Info } from "lucide-react";
import type { ResourceBlock } from "@/content/recursos/types";

export function ArticleRenderer({ blocks }: { blocks: ResourceBlock[] }) {
  return (
    <div className="space-y-6 text-[#D6E0F0] font-sans">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            if (block.level === 2) {
              return (
                <h2
                  key={`${block.id}-${index}`}
                  id={block.id}
                  className="font-display text-2xl sm:text-[28px] font-bold text-white tracking-tight pt-6 pb-2 border-b border-[rgba(175,196,232,0.12)] scroll-mt-28"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <h3
                key={`${block.id}-${index}`}
                id={block.id}
                className="font-display text-lg sm:text-xl font-semibold text-white tracking-tight pt-4 scroll-mt-28"
              >
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={index} className="text-base sm:text-[17px] leading-[1.78] text-[#C8D3E6]">
                {block.text}
              </p>
            );

          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`space-y-3 pl-5 ${
                  block.ordered ? "list-decimal" : "list-disc"
                } marker:text-[#2B85FF]`}
              >
                {block.items.map((item, idx) => (
                  <li key={idx} className="text-base leading-[1.7] text-[#C8D3E6] pl-1">
                    {item.title ? (
                      <strong className="text-white font-semibold">{item.title}: </strong>
                    ) : null}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ListTag>
            );
          }

          case "table":
            return (
              <div key={index} className="rounded-2xl border border-[#252D3A] bg-[#0D121D] overflow-hidden my-6">
                {block.caption ? (
                  <div className="px-4 py-2.5 border-b border-[#252D3A] bg-[#080B12] text-xs font-mono text-[#AFC4E8]">
                    {block.caption}
                  </div>
                ) : null}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#252D3A] bg-[#141B2B]/70">
                        {block.headers.map((header, hIdx) => (
                          <th
                            key={hIdx}
                            scope="col"
                            className="px-4 py-3 font-display font-semibold text-xs uppercase tracking-wider text-[#AFC4E8] whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(175,196,232,0.1)]">
                      {block.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#141B2B]/40 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-4 py-3.5 align-top leading-relaxed ${
                                cIdx === 0 ? "font-medium text-white" : "text-[#C8D3E6]"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );

          case "callout": {
            const toneStyles = {
              info: {
                box: "border-[#1677FF]/45 bg-[#1677FF]/10",
                icon: <Info className="w-5 h-5 text-[#2B85FF] shrink-0 mt-0.5" aria-hidden="true" />,
              },
              decision: {
                box: "border-emerald-500/40 bg-emerald-500/10",
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />,
              },
              warning: {
                box: "border-amber-500/40 bg-amber-500/10",
                icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />,
              },
            }[block.tone];

            return (
              <blockquote
                key={index}
                className={`rounded-2xl border p-5 sm:p-6 flex items-start gap-3.5 ${toneStyles.box}`}
              >
                {toneStyles.icon}
                <div className="space-y-1.5">
                  <p className="font-display text-sm sm:text-base font-bold text-white">
                    {block.title}
                  </p>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-[#D6E0F0]">
                    {block.text}
                  </p>
                </div>
              </blockquote>
            );
          }

          case "code":
            return (
              <div key={index} className="rounded-2xl border border-[#252D3A] bg-[#05070C] overflow-hidden my-6">
                <div className="px-4 py-2.5 border-b border-[#252D3A] bg-[#0D121D] flex items-center justify-between text-xs font-mono text-[#AFC4E8]">
                  <span className="inline-flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
                    <span>{block.filename || block.language}</span>
                  </span>
                  <span className="uppercase text-[10px] tracking-wider text-[#8F9BB3]">{block.language}</span>
                </div>
                <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono text-[#AFC4E8]">
                  <code>{block.code}</code>
                </pre>
              </div>
            );

          case "figure":
            return (
              <figure key={index} className="rounded-2xl border border-[#252D3A] bg-[#0D121D] overflow-hidden my-6">
                <div className="relative w-full aspect-[16/9] bg-[#080B12]">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 760px"
                    className="object-contain"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="px-4 py-3 border-t border-[#252D3A] text-xs font-mono text-[#8F9BB3]">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
        }
      })}
    </div>
  );
}

