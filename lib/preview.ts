export type PreviewId = "quick" | "full";

export type PreviewTrip = {
  id: PreviewId;
  title: string;
  cabin: string;
  summary: string;
  flight: string;
  normal: string;
  hacked: string;
  savings: string;
  savingsPct: string;
  held: string;
  heldNote: string;
  earned: string;
  bestCard: string;
  alternatives: { card: string; note: string }[];
  steps: { title: string; detail: string }[];
  warnings: string[];
  assumptions: string[];
  reference: string;
  legs: { from: string; to: string; when: string; carrier: string }[];
};

export const trips: Record<PreviewId, PreviewTrip> = {
  quick: {
    id: "quick",
    title: "Delhi → Mumbai",
    cabin: "Economy",
    summary: "One way · 1 passenger",
    flight: "IndiGo · nonstop · 18 Nov 2026",
    normal: "€82.40",
    hacked: "€46.28",
    savings: "€36.12",
    savingsPct: "44% under the normal fare",
    held: "€32.00",
    heldNote: "3,200 HDFC Infinia points",
    earned: "€4.12",
    bestCard: "HDFC Infinia",
    alternatives: [
      { card: "Axis Atlas", note: "Would save €21.40 instead" },
    ],
    steps: [
      {
        title: "Keep the Infinia points for this fare",
        detail: "They cover €32.00 of the Delhi–Mumbai ticket at the sample value.",
      },
      {
        title: "Pay the rest with Infinia",
        detail: "The remaining €50.40 still earns rewards on the flight category.",
      },
      {
        title: "Count the new rewards",
        detail: "That purchase earns about €4.12 back, on top of the points you already hold.",
      },
      {
        title: "Skip Atlas for this route",
        detail: "Atlas still saves money, just less than Infinia on a short economy fare.",
      },
      {
        title: "Book the sample fare",
        detail: "This preview does not take payment. The next screen is the passenger form.",
      },
    ],
    warnings: [
      "Point value is an estimate, not a guaranteed award seat.",
      "These fares are sample numbers so you can click through the screens.",
    ],
    assumptions: [
      "Infinia points valued at 1 cent for this sample.",
      "Flight earn rate used for the new-rewards line only.",
      "Rates shown as verified 1 Oct 2026.",
    ],
    reference: "UM-1842",
    legs: [
      {
        from: "Delhi (DEL)",
        to: "Mumbai (BOM)",
        when: "18 Nov 2026 · 09:15",
        carrier: "IndiGo 6E 213",
      },
    ],
  },
  full: {
    id: "full",
    title: "Delhi → Dubai → London → Delhi",
    cabin: "Business",
    summary: "Three legs · 1 passenger",
    flight: "Emirates · 4–12 Dec 2026",
    normal: "€1,864.00",
    hacked: "€1,350.80",
    savings: "€513.20",
    savingsPct: "28% under the normal fare",
    held: "€420.00",
    heldNote: "28,000 Axis Atlas points",
    earned: "€93.20",
    bestCard: "Axis Atlas",
    alternatives: [
      { card: "HDFC Infinia", note: "Would save €368.00 instead" },
    ],
    steps: [
      {
        title: "Use Atlas points on the long haul",
        detail: "The sample puts €420.00 of value against the business fare.",
      },
      {
        title: "Pay Dubai and the taxes with Atlas",
        detail: "The rest of the ticket stays on Atlas because the flight earn rate is higher here.",
      },
      {
        title: "Add the rewards this booking earns",
        detail: "New points on the unpaid part come to about €93.20.",
      },
      {
        title: "Leave Infinia for a cash-heavy month",
        detail: "Infinia still saves a lot, but less than Atlas on this business routing.",
      },
      {
        title: "Book when the fare is still the sample price",
        detail: "The passenger screen is next. No payment is taken in this preview.",
      },
    ],
    warnings: [
      "Redemption value is a valuation, not a seat the airline has promised.",
      "A real search would replace these sample fares.",
    ],
    assumptions: [
      "Atlas points valued at €1.50 for this sample.",
      "One cabin for the whole trip: Business.",
      "Rates shown as verified 1 Oct 2026.",
    ],
    reference: "UM-1904",
    legs: [
      {
        from: "Delhi (DEL)",
        to: "Dubai (DXB)",
        when: "4 Dec 2026 · 04:20",
        carrier: "Emirates EK 513",
      },
      {
        from: "Dubai (DXB)",
        to: "London (LHR)",
        when: "6 Dec 2026 · 08:55",
        carrier: "Emirates EK 7",
      },
      {
        from: "London (LHR)",
        to: "Delhi (DEL)",
        when: "12 Dec 2026 · 21:10",
        carrier: "Emirates EK 4",
      },
    ],
  },
};
