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
  summary: "How a request moves through the Glowstone store: a serverless TypeScript backend on AWS.",
  initial: "apigw",
  nodes: [
    {
      id: "browser",
      label: "Browser",
      sub: "Store + studio",
      col: 0,
      row: 1,
      title: "Storefront and admin studio",
      body: "A prerendered React storefront with customer accounts and cash-on-delivery checkout, and a mobile-first admin studio for orders, stock, photos and newsletters.",
      facts: ["PageSpeed mobile 100 on the home page", "Lighthouse SEO and accessibility 100"],
    },
    {
      id: "cloudfront",
      label: "CloudFront",
      sub: "Edge",
      col: 1,
      row: 1,
      title: "CloudFront",
      body: "The edge in front of the store. Images are served through it in six responsive widths, and a CloudFront Function protects the on-demand resizer from abuse.",
      facts: ["6 responsive image widths"],
    },
    {
      id: "apigw",
      label: "API Gateway",
      sub: "JWT authorizer",
      col: 2,
      row: 1,
      title: "API Gateway with JWT authorizers",
      body: "Every protected request is verified by an API Gateway JWT authorizer before any code runs, so a bad token never reaches a function. CORS is locked to the production sites.",
      facts: ["Tokens checked before any code runs", "CORS locked to the production sites"],
    },
    {
      id: "lambda",
      label: "Lambda",
      sub: "TypeScript",
      col: 3,
      row: 1,
      title: "Lambda functions in TypeScript",
      body: "The serverless backend. Orders run as locked, single transactions, so a limited edition can never oversell. Orders and email sends are safe to retry, so a double tap never creates a duplicate order.",
      facts: ["1,800+ automated tests", "Error alerts"],
    },
    {
      id: "rds",
      label: "PostgreSQL",
      sub: "RDS",
      col: 4,
      row: 1,
      title: "RDS PostgreSQL in a private VPC",
      body: "The database sits inside a private VPC. Stock and orders change inside one locked transaction, which is what makes overselling impossible. Cognito triggers keep customer accounts in sync here.",
      facts: ["Private VPC", "Daily backups"],
    },
    {
      id: "cognito",
      label: "Cognito",
      sub: "2 user pools",
      col: 2,
      row: 0,
      title: "Two Cognito user pools",
      body: "Customers and admins sign in through two separate user pools, so a customer account can never be an admin account. Cognito triggers sync accounts into PostgreSQL.",
      facts: ["2 separate user pools", "Accounts synced by triggers"],
    },
    {
      id: "resizer",
      label: "Image resizer",
      sub: "On demand",
      col: 1,
      row: 2,
      title: "On-demand image resizer",
      body: "Each photo is resized on demand and served through CloudFront in six responsive widths, so phones never download a desktop-size image. A CloudFront Function protects the resizer from abuse.",
      facts: ["6 responsive widths"],
    },
    {
      id: "s3",
      label: "S3",
      sub: "Photos",
      col: 0,
      row: 2,
      title: "S3 image storage",
      body: "Photos upload straight from the studio to S3 through presigned URLs, without passing through the API, and are then processed server-side with sharp.",
      facts: ["Presigned uploads", "Processed with sharp"],
    },
    {
      id: "ses",
      label: "SES",
      sub: "Email",
      col: 3,
      row: 2,
      title: "SES email",
      body: "Domain-authenticated email (DKIM, DMARC) for order-status notifications and a newsletter with one-click unsubscribe. Sends are safe to retry.",
      facts: ["DKIM and DMARC", "One-click unsubscribe"],
    },
  ],
  routes: [
    { id: "api", label: "API request", path: ["browser", "cloudfront", "apigw", "lambda", "rds"] },
    { id: "auth", label: "Sign-in", path: ["browser", "cognito", "apigw"] },
    { id: "image", label: "Image request", path: ["browser", "cloudfront", "resizer", "s3"] },
    { id: "upload", label: "Photo upload", path: ["browser", "s3"] },
    { id: "email", label: "Email", path: ["lambda", "ses"] },
  ],
  zones: [{ label: "Private VPC", nodes: ["rds"] }],
};

const sushiTsunami: Diagram = {
  id: "sushi-tsunami",
  name: "Sushi Tsunami",
  summary:
    "The layers behind the reservation and floor-management platform, and where the peak-hour incident was fixed.",
  initial: "pool",
  nodes: [
    {
      id: "staff",
      label: "Staff app",
      sub: "React 19",
      col: 0,
      row: 1,
      title: "The staff app",
      body: "The React 19 and TypeScript app the restaurant's staff use daily to run service: bookings, walk-ins, table merges, seating and billing. Routing is role-gated and tokens refresh on their own.",
      facts: ["82 automated tests", "Used daily in service"],
    },
    {
      id: "cognito",
      label: "Cognito",
      sub: "TOTP MFA",
      col: 1,
      row: 0,
      title: "Sign-in, roles and MFA",
      body: "Cognito with TOTP multi-factor authentication and JWT verification. Four roles are enforced on the client and on every API route, and the full user lifecycle is managed through the Cognito Admin APIs.",
      facts: ["4 roles", "TOTP multi-factor auth"],
    },
    {
      id: "api",
      label: "REST API",
      sub: "35 endpoints",
      col: 1,
      row: 1,
      title: "REST API controllers",
      body: "HTTP controllers with schema-defined request validation. They hold no SQL: a request is checked here, then handed to the service layer.",
      facts: ["35 REST endpoints", "Schema-defined validation"],
    },
    {
      id: "errors",
      label: "Error handler",
      sub: "~20 conditions",
      col: 1,
      row: 2,
      title: "One central error handler",
      body: "One handler maps about 20 error conditions to the right HTTP status codes. Part of the incident fix lives here: transient database errors now return the correct status codes.",
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
      sub: "Incident fix",
      col: 3,
      row: 1,
      title: "The peak-hour incident",
      body: "During peak service the platform hit a live incident. I traced it to database connection exhaustion and fixed it across three layers: connection pooling, server-side idle-session timeouts and correct transient-error status codes. Then I load-tested the fix under rush-hour concurrency.",
      facts: ["0 errors in the load test", "105 ms p50", "379 ms p95"],
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
