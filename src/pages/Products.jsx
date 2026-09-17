import React from "react";
import "./tokens.css";
import "./Products.css";

const products = [
  {
    name: "Ridgeline",
    status: "Active",
    category: "Dev tools",
    note: "Infra observability for small teams. Founded 2023, profitable since Q1 2026.",
  },
  {
    name: "Fernway",
    status: "Active",
    category: "Consumer",
    note: "Trip planning app built around slow travel. Bootstrapped, 40k monthly users.",
  },
  {
    name: "Cropline",
    status: "Struggling",
    category: "Agtech",
    note: "Farm inventory software. Down two rounds in eighteen months, hiring freeze since March.",
  },
  {
    name: "Ostium",
    status: "Active",
    category: "Fintech",
    note: "Invoice financing for freelancers. Series A closed, growing 8% month over month.",
  },
  {
    name: "Palewood",
    status: "Struggling",
    category: "E-commerce",
    note: "Direct-to-consumer furniture. Margins compressed by freight costs, exploring a sale.",
  },
  {
    name: "Innkeep",
    status: "Active",
    category: "Hospitality",
    note: "Booking software for independent hotels. Two-person team, steady since 2021.",
  },
];

const statusClass = (status) =>
  status === "Active" ? "status-active" : "status-struggling";

const Products = () => {
  return (
    <main className="page products-page">
      <p className="page-kicker">Companies still standing</p>
      <h1 className="page-title">Products</h1>
      <p className="page-dek">
        A running directory of the companies we've written about that are
        still operating — including the ones on shaky ground. Status is
        updated as we hear about it.
      </p>
      <hr className="rule" />

      <div className="products-table">
        <div className="products-row products-row-head">
          <span>Name</span>
          <span>Category</span>
          <span>Status</span>
          <span>Note</span>
        </div>
        {products.map((p) => (
          <div key={p.name} className="products-row">
            <span className="products-name">{p.name}</span>
            <span className="products-category">{p.category}</span>
            <span className={`products-status ${statusClass(p.status)}`}>
              {p.status}
            </span>
            <span className="products-note">{p.note}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Products;