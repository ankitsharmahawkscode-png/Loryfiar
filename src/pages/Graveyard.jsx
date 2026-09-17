import React from "react";
import "./tokens.css";
import "./Graveyard.css";

const graves = [
  {
    name: "Huddlebox",
    years: "2019–2023",
    cause: "Ran out of runway",
    note: "Team collaboration tool. Raised a $6M seed, never found a wedge past free tier.",
  },
  {
    name: "Ferrycart",
    years: "2020–2022",
    cause: "Acquihired, then shut down",
    note: "Grocery logistics middleware. Bought for the engineering team, product killed within a year.",
  },
  {
    name: "Notionale",
    years: "2021–2024",
    cause: "Founder dispute",
    note: "Docs-and-wiki app. Cofounders split equity 50/50 with no tiebreaker clause.",
  },
  {
    name: "Ledgerly",
    years: "2018–2021",
    cause: "Regulatory shutdown",
    note: "Consumer micro-investing app. Couldn't clear a state-by-state licensing review in time.",
  },
  {
    name: "Warmlead",
    years: "2022–2023",
    cause: "No product-market fit",
    note: "Sales enrichment tool. Eleven months, three pivots, same core problem: nobody paid twice.",
  },
  {
    name: "Ovenly",
    years: "2020–2022",
    cause: "Ran out of runway",
    note: "Cloud kitchen marketplace. Unit economics never cleared delivery fees.",
  },
];

const Graveyard = () => {
  return (
    <main className="page graveyard-page">
      <p className="page-kicker">A record, not a roast</p>
      <h1 className="page-title">Graveyard</h1>
      <p className="page-dek">
        Companies that shut down, and the specific reason each one gives when
        you ask directly. Sorted by nothing in particular — this isn't a
        ranking.
      </p>
      <hr className="rule" />

      <ul className="grave-grid">
        {graves.map((g) => (
          <li key={g.name} className="grave-stone">
            <div className="grave-stone-top">
              <h2>{g.name}</h2>
              <span className="grave-years">{g.years}</span>
            </div>
            <p className="grave-cause">{g.cause}</p>
            <p className="grave-note">{g.note}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Graveyard;