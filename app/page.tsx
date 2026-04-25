"use client";

import { useMemo, useState } from "react";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  filingFor: string;
  province: string;
  clientType: string;
  filedLastYear: string;
  incomeTypes: string[];
  credits: string[];
  specialSituations: string[];
  notes: string;
  consent: boolean;
};

const provinces = [
  "Ontario",
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

const incomeOptions = [
  "Employment income (T4)",
  "Student income / tuition",
  "Pension / retirement income",
  "Self-employment / sole proprietor",
  "Delivery / rideshare income (Uber, Lyft, DoorDash, Skip, Instacart, Amazon Flex)",
  "Rental income / Airbnb",
  "Investment income (T3, T5, T5008)",
  "Capital gains / crypto / stock sales",
  "Foreign income or foreign assets",
];

const creditOptions = [
  "RRSP contributions",
  "Tuition / student credits",
  "Medical expenses",
  "Childcare expenses",
  "Work-from-home / employment expenses",
  "Charitable donations",
  "Union / professional dues",
  "Student loan interest",
  "Moving expenses",
  "Disability tax credit",
  "First-time home buyer",
];

const specialOptions = [
  "Unfiled prior years",
  "CRA notice / review / audit",
  "Sold property",
  "New to Canada / left Canada",
  "Business or rental records are not ready",
];

const calendlyLink = "https://calendly.com/harsh-scaleupaccounting/30min";
const documentEmail = "harsh@scaleupaccounting.net";

export default function Page() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    filingFor: "",
    province: "",
    clientType: "",
    filedLastYear: "",
    incomeTypes: [],
    credits: [],
    specialSituations: [],
    notes: "",
    consent: false,
  });

  function updateField(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleArray(field: "incomeTypes" | "credits" | "specialSituations", value: string) {
    setForm((prev) => {
      const current = prev[field];
      const exists = current.includes(value);

      return {
        ...prev,
        [field]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  }

  const result = useMemo(() => {
    const manualReview =
      form.incomeTypes.includes("Foreign income or foreign assets") ||
      form.specialSituations.includes("Unfiled prior years") ||
      form.specialSituations.includes("CRA notice / review / audit") ||
      form.specialSituations.includes("New to Canada / left Canada") ||
      form.specialSituations.includes("Business or rental records are not ready");

    const checklist = new Set<string>([
      "Government-issued ID",
      "SIN",
      "Last year Notice of Assessment",
      "All tax slips received from CRA, employer, school, bank, or investment institution",
    ]);

    if (form.incomeTypes.includes("Employment income (T4)")) {
      checklist.add("T4 slips");
      checklist.add("T4A slips, if applicable");
    }

    if (
      form.incomeTypes.includes("Student income / tuition") ||
      form.credits.includes("Tuition / student credits")
    ) {
      checklist.add("T2202 tuition slip");
      checklist.add("T4A scholarship / grant slip, if applicable");
      checklist.add("Student loan interest statement, if claiming");
    }

    if (form.incomeTypes.includes("Pension / retirement income")) {
      checklist.add("CPP / OAS / pension slips such as T4A(P), T4A(OAS), T4RSP, or T4RIF");
    }

    if (form.incomeTypes.includes("Investment income (T3, T5, T5008)")) {
      checklist.add("T3, T5, and T5008 slips");
      checklist.add("Annual investment tax package, if available");
    }

    if (form.incomeTypes.includes("Capital gains / crypto / stock sales")) {
      checklist.add("Realized gain/loss report");
      checklist.add("Buy/sell transaction summary");
      checklist.add("Crypto exchange report, if applicable");
    }

    if (
      form.incomeTypes.includes("Self-employment / sole proprietor") ||
      form.incomeTypes.includes(
        "Delivery / rideshare income (Uber, Lyft, DoorDash, Skip, Instacart, Amazon Flex)"
      )
    ) {
      checklist.add("Business or platform income summary");
      checklist.add("Expense summary by category");
      checklist.add("Business bank or credit card summaries, if available");
      checklist.add("GST/HST information, if registered");
    }

    if (
      form.incomeTypes.includes(
        "Delivery / rideshare income (Uber, Lyft, DoorDash, Skip, Instacart, Amazon Flex)"
      )
    ) {
      checklist.add("Platform annual summaries: Uber, Lyft, DoorDash, Skip, Instacart, Amazon Flex, etc.");
      checklist.add("Vehicle total kilometres and business kilometres");
      checklist.add("Vehicle expense summary: gas, insurance, repairs, lease/loan, parking, tolls");
    }

    if (form.incomeTypes.includes("Rental income / Airbnb")) {
      checklist.add("Rental income total");
      checklist.add("Rental expense summary");
      checklist.add("Mortgage interest statement");
      checklist.add("Property tax bill, insurance, repairs, utilities, condo fees, legal/accounting fees");
    }

    if (form.credits.includes("RRSP contributions")) checklist.add("RRSP contribution receipts");
    if (form.credits.includes("Medical expenses")) checklist.add("Medical expense summary");
    if (form.credits.includes("Childcare expenses")) {
      checklist.add("Childcare receipt with provider name, SIN/BN, child name, and amount paid");
    }
    if (form.credits.includes("Work-from-home / employment expenses")) {
      checklist.add("T2200 / T2200S and employment expense summary");
    }
    if (form.credits.includes("Charitable donations")) checklist.add("Official donation receipts");
    if (form.credits.includes("Union / professional dues")) {
      checklist.add("Union or professional dues receipt, if not shown on T4");
    }
    if (form.credits.includes("Student loan interest")) checklist.add("Student loan interest statement");
    if (form.credits.includes("Moving expenses")) {
      checklist.add("Moving receipts, old/new address proof, employer/school details, and proof of 40km move");
    }
    if (form.credits.includes("Disability tax credit")) {
      checklist.add("DTC approval letter or CRA confirmation");
    }
    if (form.credits.includes("First-time home buyer")) {
      checklist.add("Home purchase closing statement and purchase date");
    }

    if (form.specialSituations.includes("CRA notice / review / audit")) {
      checklist.add("CRA notice / review / audit letter");
    }
    if (form.specialSituations.includes("Unfiled prior years")) {
      checklist.add("List of unfiled years and available slips");
    }
    if (form.specialSituations.includes("Sold property")) {
      checklist.add("Property purchase/sale documents and principal residence details");
    }
    if (form.specialSituations.includes("New to Canada / left Canada")) {
      checklist.add("Date entered/left Canada and foreign income details");
    }

    return {
      manualReview,
      checklist: Array.from(checklist),
    };
  }, [form]);

  if (!started) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200/70 md:p-12">
          <div className="mb-4 inline-block rounded-full bg-[#e9f7ef] px-4 py-2 text-sm font-semibold text-[#10884d]">
            File before April 30
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#3478f6]">
            Personal Tax Filing
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#1f2937] md:text-4xl">
            Deadline is <span className="text-[#3478f6]">almost here.</span>
          </h1>

          <p className="mt-4 text-sm text-slate-600 md:text-base">
            Complete a quick intake to get your document checklist and next steps.
          </p>

          <div className="mt-6 grid gap-3 text-left md:grid-cols-3">
            <InfoCard title="Document checklist" text="Based on your situation" />
            <InfoCard title="Fast next step" text="Book or send documents" />
            <InfoCard title="Professional review" text="Handled by ScaleUp" />
          </div>

          <button
            onClick={() => {
              setStarted(true);
              setStep(1);
            }}
            className="mt-8 w-full rounded-xl bg-[#3478f6] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#2563eb] md:w-auto"
          >
            Start Tax Intake →
          </button>

          <p className="mt-4 text-xs text-slate-500">
            Simple · Fast · CRA-ready · No upfront payment
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-5 py-6 text-[#303142]">
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70 md:p-10">
        <button
          onClick={() => {
            if (step === 1) setStarted(false);
            else setStep(step - 1);
          }}
          className="mb-6 text-sm font-semibold text-[#3478f6]"
        >
          ← Back
        </button>

        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3478f6]">
              Step {step} of 5
            </p>

            <span className="rounded-full bg-[#e9f7ef] px-3 py-1 text-xs font-semibold text-[#10884d]">
              {step === 1 && "Contact Details"}
              {step === 2 && "Income Types"}
              {step === 3 && "Credits & Deductions"}
              {step === 4 && "Final Details"}
              {step === 5 && "Next Steps"}
            </span>
          </div>

          <div className="mb-6 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-[#3478f6] transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          <StepHeading step={step} />
        </div>

        {step === 1 && (
          <div className="grid gap-5">
            <TextInput placeholder="Full name" value={form.fullName} onChange={(v) => updateField("fullName", v)} />
            <TextInput placeholder="Email address" type="email" value={form.email} onChange={(v) => updateField("email", v)} />
            <TextInput placeholder="Phone number" type="tel" value={form.phone} onChange={(v) => updateField("phone", v)} />

            <div className="grid gap-4 md:grid-cols-2">
              <SelectInput value={form.filingFor} onChange={(v) => updateField("filingFor", v)} options={["Self", "Self + spouse"]} placeholder="Filing for" />
              <SelectInput value={form.province} onChange={(v) => updateField("province", v)} options={provinces} placeholder="Province of residence" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectInput value={form.clientType} onChange={(v) => updateField("clientType", v)} options={["Yes", "No"]} placeholder="First-time client?" />
              <SelectInput value={form.filedLastYear} onChange={(v) => updateField("filedLastYear", v)} options={["Yes", "No", "Not sure"]} placeholder="Filed last year?" />
            </div>

            <NavButton text="Continue →" onClick={() => setStep(2)} />
          </div>
        )}

        {step === 2 && (
          <OptionList
            options={incomeOptions}
            selected={form.incomeTypes}
            color="blue"
            onToggle={(option) => toggleArray("incomeTypes", option)}
            buttonText="Continue →"
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <OptionList
            options={creditOptions}
            selected={form.credits}
            color="green"
            onToggle={(option) => toggleArray("credits", option)}
            buttonText="Continue →"
            onContinue={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <div className="grid gap-5">
            <OptionButtons
              options={specialOptions}
              selected={form.specialSituations}
              color="amber"
              onToggle={(option) => toggleArray("specialSituations", option)}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Anything else ScaleUp Accounting should know?
              </span>
              <textarea
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Optional notes..."
                className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3478f6] focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
                className="mt-1"
              />
              <span>
                I understand this is an intake request and not tax advice until ScaleUp
                Accounting reviews my information.
              </span>
            </label>

            <NavButton
              text="View Next Steps →"
              disabled={!form.consent}
              onClick={() => setStep(5)}
            />
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-6">
            {result.manualReview ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                Thanks — based on your selections, your return may require a custom review.
                Someone from ScaleUp Accounting will review your intake and contact you within a few hours.
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-[#e9f7ef] p-5 text-sm leading-6 text-emerald-900">
                Based on your selections, you may book a tax discovery call or email your documents directly to ScaleUp Accounting.
              </div>
            )}

            <div>
              <h2 className="mb-3 text-lg font-semibold">Document checklist</h2>
              <div className="grid gap-2">
                {result.checklist.map((item) => (
                  <div key={item} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
              <p><strong>Send documents to:</strong> {documentEmail}</p>
              <p><strong>Subject line:</strong> Tax Filing 2025 - {form.fullName || "Full Name"}</p>
              <p className="mt-2">
                Please attach your tax slips, government ID, SIN, last year Notice of Assessment,
                and any supporting documents related to the items selected above.
              </p>
            </div>

            {!result.manualReview ? (
              <a
                href={calendlyLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-[#3478f6] px-6 py-4 text-center font-semibold text-white hover:bg-[#2563eb]"
              >
                Book Tax Discovery Call →
              </a>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setStarted(false);
                setStep(1);
              }}
              className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600"
            >
              Start over
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function StepHeading({ step }: { step: number }) {
  const content: Record<number, { title: string; text: string }> = {
    1: {
      title: "Let’s start with the basics",
      text: "Tell us who you are so ScaleUp Accounting can guide your tax filing properly.",
    },
    2: {
      title: "What income types apply?",
      text: "Select all that apply. This helps generate your document checklist.",
    },
    3: {
      title: "Which credits or deductions may apply?",
      text: "Select anything you may want to claim. If unsure, select it and ScaleUp Accounting will review.",
    },
    4: {
      title: "Final details",
      text: "Select any special situations and add optional notes before viewing next steps.",
    },
    5: {
      title: "Your next steps",
      text: "Review your document checklist and choose how to proceed.",
    },
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-[#1f2937] md:text-3xl">
        {content[step].title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">{content[step].text}</p>
    </>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </div>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3478f6] focus:ring-2 focus:ring-blue-100"
    />
  );
}

function SelectInput({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3478f6] focus:ring-2 focus:ring-blue-100"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function OptionList({
  options,
  selected,
  color,
  onToggle,
  buttonText,
  onContinue,
}: {
  options: string[];
  selected: string[];
  color: "blue" | "green";
  onToggle: (value: string) => void;
  buttonText: string;
  onContinue: () => void;
}) {
  return (
    <div className="grid gap-3">
      <OptionButtons options={options} selected={selected} color={color} onToggle={onToggle} />
      <NavButton text={buttonText} onClick={onContinue} />
    </div>
  );
}

function OptionButtons({
  options,
  selected,
  color,
  onToggle,
}: {
  options: string[];
  selected: string[];
  color: "blue" | "green" | "amber";
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const active = selected.includes(option);

        const activeClass =
          color === "blue"
            ? "border-[#3478f6] bg-blue-50 text-[#1f5fc2]"
            : color === "green"
            ? "border-[#10884d] bg-[#e9f7ef] text-[#0f7a43]"
            : "border-amber-400 bg-amber-50 text-amber-900";

        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
              active
                ? activeClass
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {active ? "✓ " : ""}
            {option}
          </button>
        );
      })}
    </div>
  );
}

function NavButton({
  text,
  onClick,
  disabled = false,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="text-xs text-slate-500">No payment required</p>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rounded-xl bg-[#3478f6] px-6 py-3 font-semibold text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {text}
      </button>
    </div>
  );
}