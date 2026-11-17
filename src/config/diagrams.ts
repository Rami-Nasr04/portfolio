/**
 * The two architecture diagrams in "How I build". Nodes sit on a 5 x 3 grid: wide screens
 * read it left to right, phones get the same grid turned on its side. Every fact here comes
 * from the CV.
 */
export interface DiagramNode {
  id: string;
  label: string;
  sub: string;
  col: number;
  row: number;
  title: string;
  body: string;
  facts: string[];
}

export interface DiagramRoute {
  id: string;
  label: string;
  /** Node ids in the order a request travels through them. */
  path: string[];
}

export interface DiagramZone {
  label: string;
  nodes: string[];
}

export interface Diagram {
  id: string;
  name: string;
  summary: string;
  /** The node that is open when the diagram first shows. */
  initial: string;
  nodes: DiagramNode[];
  routes: DiagramRoute[];
  zones: DiagramZone[];
}

const glowstone: Diagram = {
  id: "glowstone",
  name: "Glowstone",
  summary:
    "How a request moves through the Glowstone store: two sites on Vercel in front of a serverless TypeScript backend on AWS.",
  initial: "private",
  nodes: [
    {
      id: "browser",
      label: "Shop + Studio",
      sub: "Vercel",
      col: 0,
      row: 1,
      title: "The shop and the studio",
      body:
        "One codebase builds two sites on Vercel: a prerendered shop, and a private studio where the owner runs orders, stock, photos and announcements from a phone. Stock and prices are fetched fresh on load, so a static page never shows a stale count.",
      facts: ["PageSpeed mobile 100 on the home page","Lighthouse SEO and accessibility 100"],
    },
    {
      id: "cognito",
      label: "Cognito",
      sub: "2 user pools",
      col: 1,
      row: 0,
      title: "Two Cognito user pools",
      body:
        "Customers and admins sign in against separate user pools, so a customer token can never open the studio and the two sessions never mix. Cognito triggers keep a customer row in sync in PostgreSQL.",
      facts: ["2 separate user pools","Accounts synced by triggers"],
    },
    {
      id: "apigw",
      label: "API Gateway",
      sub: "JWT authorizers",
      col: 1,
      row: 1,
      title: "API Gateway with JWT authorizers",
      body:
        "JWT authorizers accept only customer-pool tokens on account routes and only admin-pool tokens on studio routes, before any code runs. CORS allows only the two production sites, and the public sign-up route is throttled.",
      facts: ["Tokens checked before any code runs","CORS locked to the two production sites"],
    },
    {
      id: "lambda",
      label: "Lambda",
      sub: "37 functions",
      col: 2,
      row: 1,
      title: "Lambda functions in TypeScript",
      body:
        "Every request is validated with Zod and answers in one response envelope. Orders and announcement sends carry a client-generated request id with a unique constraint, so a retry returns the first result and never creates a duplicate.",
      facts: ["37 functions","1,650+ automated tests across the API and the frontend","Alarms on any API 5xx or function error"],
    },
    {
      id: "ses",
      label: "SES",
      sub: "Email",
      col: 2,
      row: 0,
      title: "SES email",
      body:
        "Email from the store's own domain, authenticated with DKIM and DMARC. Announcements carry a signed one-click unsubscribe link, and sending is paced under the SES rate.",
      facts: ["DKIM and DMARC","One-click unsubscribe"],
    },
    {
      id: "private",
      label: "VPC functions",
      sub: "Private",
      col: 3,
      row: 1,
      title: "A private database without a NAT gateway",
      body:
        "Functions that touch the database run inside the VPC, which has no internet access. Functions that also need email or the deploy hook run outside it and call small private functions for the database part. The database stays private and the store avoids paying for a NAT gateway.",
      facts: ["No NAT gateway","Database never reachable from the internet"],
    },
    {
      id: "rds",
      label: "PostgreSQL",
      sub: "RDS",
      col: 4,
      row: 1,
      title: "RDS PostgreSQL",
      body:
        "An order is one transaction that locks the products it buys, checks and reduces the stock, and snapshots the prices. Cancelling returns the stock in the same transaction, and database constraints keep stock from going below zero or above the edition size.",
      facts: ["Row locks in a fixed order, so two orders cannot deadlock","Daily backups"],
    },
    {
      id: "cloudfront",
      label: "CloudFront",
      sub: "Photo CDN",
      col: 0,
      row: 2,
      title: "CloudFront for photos",
      body:
        "Product photos are served through CloudFront. A CloudFront Function in front lets through only the six allowed widths, so made-up URLs never reach the resizer.",
      facts: ["6 allowed widths, 480 to 2880 px"],
    },
    {
      id: "resizer",
      label: "Image resizer",
      sub: "sharp",
      col: 1,
      row: 2,
      title: "On-demand image resizer",
      body:
        "A Lambda function resizes each photo on demand with sharp, so phones never download a desktop-size image. Its concurrency is capped, so it cannot run up the bill.",
      facts: ["Capped concurrency"],
    },
    {
      id: "s3",
      label: "S3",
      sub: "Photos",
      col: 2,
      row: 2,
      title: "S3 photo storage",
      body:
        "The studio uploads straight to S3 with a presigned POST, without passing the file through the API. The API then validates each photo and processes it with sharp into a master.",
      facts: ["Presigned uploads","Processed with sharp"],
    },
  ],
  routes: [
    { id: "api", label: "API request", path: ["browser", "apigw", "lambda", "private", "rds"] },
    { id: "auth", label: "Sign-in", path: ["browser", "cognito", "apigw"] },
    { id: "image", label: "Photo request", path: ["browser", "cloudfront", "resizer", "s3"] },
    { id: "upload", label: "Photo upload", path: ["browser", "s3"] },
    { id: "email", label: "Email", path: ["lambda", "ses"] },
  ],
  zones: [{ label: "Private VPC", nodes: ["private", "rds"] }],
};

const sushiTsunami: Diagram = {
  id: "sushi-tsunami",
  name: "Sushi Tsunami",
  summary:
    "The layers behind the reservation and floor-management platform, and what a rush-hour load test changed.",
  initial: "pool",
  nodes: [
    {
      id: "staff",
      label: "Staff app",
      sub: "React 19, Vercel",
      col: 0,
      row: 1,
      title: "The staff app",
      body: "The React 19 and TypeScript app the restaurant's staff use daily to run service: bookings, walk-ins, table merges, seating and billing. Routing is role-gated and tokens refresh on their own.",
      facts: ["73 frontend tests", "Used daily in service"],
    },
    {
      id: "cognito",
      label: "Cognito",
      sub: "4 roles",
      col: 1,
      row: 0,
      title: "Sign-in, roles and MFA",
      body: "Staff sign in through Cognito, and every route except the health check sits behind a JWT authorizer. Four roles (manager, supervisor, host and view-only staff) gate what each person can do, and managers run the full user lifecycle through the Cognito Admin APIs. TOTP multi-factor auth is built in; the client currently runs with it switched off.",
      facts: ["4 roles", "JWT authorizer on every data route"],
    },
    {
      id: "api",
      label: "REST API",
      sub: "API Gateway + Lambda",
      col: 1,
      row: 1,
      title: "REST API controllers",
      body: "Thin Lambda handlers behind API Gateway, with schema-defined request validation. They hold no SQL: a request is checked here, then handed to the service layer.",
      facts: ["35 REST endpoints", "82 API tests"],
    },
    {
      id: "errors",
      label: "Error handler",
      sub: "~20 conditions",
      col: 1,
      row: 2,
      title: "One central error handler",
      body: "One handler maps about 20 error conditions to the right HTTP status codes. Part of the load-test fix lives here: when the database is out of connections the API now answers 503, so the app knows to retry.",
      facts: ["About 20 mapped error conditions"],
    },
    {
      id: "service",
      label: "Service layer",
      sub: "All the SQL",
      col: 2,
      row: 1,
      title: "The service layer",
      body: "All SQL lives here, written by hand: lateral joins that fold one-to-many relations into single rows, an idempotent upsert, a reporting view and the aggregation queries behind the manager dashboard. Bookings use atomic multi-table transactions and row-level locking.",
      facts: ["Atomic multi-table transactions", "Row-level locking"],
    },
    {
      id: "pool",
      label: "Connection pool",
      sub: "Load-test fix",
      col: 3,
      row: 1,
      title: "What the rush-hour load test found",
      body: "After a production incident I benchmarked the API at about ten times real rush-hour load. It exposed a latent problem: idle Lambda containers were holding pooled connections until PostgreSQL ran out of slots. I fixed it in three layers: a smaller pool per container with a shorter idle timeout, a server-side idle-session timeout, and a proper 503 when connections run out.",
      facts: ["0 errors over a 160-request mixed rush", "105 ms p50", "379 ms p95"],
    },
    {
      id: "db",
      label: "PostgreSQL",
      sub: "5 tables",
      col: 4,
      row: 1,
      title: "PostgreSQL",
      body: "A normalized five-table schema with foreign keys, a many-to-many junction table, CHECK constraints and targeted indexes, including a partial unique index that enforces a business rule in the database. Idle sessions now time out on the server side.",
      facts: ["5 tables", "9 versioned migrations, each verified against live data"],
    },
  ],
  routes: [
    { id: "request", label: "Request", path: ["staff", "api", "service", "pool", "db"] },
    { id: "auth", label: "Sign-in", path: ["staff", "cognito", "api"] },
    { id: "errors", label: "Errors", path: ["api", "errors"] },
  ],
  zones: [],
};

export const DIAGRAMS: Diagram[] = [glowstone, sushiTsunami];
