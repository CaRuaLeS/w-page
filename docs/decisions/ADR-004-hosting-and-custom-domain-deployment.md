# ADR-004: Static Hosting Platform & Custom Domain Strategy

## Status
Accepted

## Date
2026-08-15

## Context
The wedding website needs to be deployed online with high availability, global edge caching, fast mobile delivery, and support for a custom domain (e.g. `lucasyelena.com` or `ourwedding.love`) with automatic SSL/TLS encryption.
Key constraints:
- **Hosting cost:** $0/month ongoing hosting costs.
- **Custom domain:** Clean custom URL for printing on wedding invitations and generating QR codes.
- **Deployment workflow:** Automated deployments from a Git repository (GitHub / GitLab) or direct command-line publish.

## Decision
Deploy the static assets to **Cloudflare Pages** (or **Vercel** as primary alternative) with a custom domain managed via Cloudflare DNS / Namecheap / Porkbun.

## Alternatives Considered

### Cloudflare Pages (Recommended)
- **Pros:** 100% free with unlimited bandwidth, global edge network, fastest DNS in the world, free wildcard SSL certificates, zero cold starts, seamless custom domain routing.
- **Cons:** None for static sites.
- **Decision:** Selected as primary recommendation.

### Vercel / Netlify
- **Pros:** Excellent Git integration, free tier, automatic SSL, preview deployments.
- **Cons:** Bandwidth limits on free tiers (though rarely exceeded by a wedding site).
- **Decision:** Excellent drop-in alternative.

### GitHub Pages
- **Pros:** Native to GitHub repositories, free.
- **Cons:** Custom domain SSL provisioning can occasionally take up to 24 hours to issue certificates.
- **Decision:** Viable alternative if no third-party platform is desired.

## Custom Domain Setup Process
1. **Domain Registration:** Purchase domain on Cloudflare Registrar, Namecheap, or Porkbun (~$8–$12/year).
2. **DNS Configuration:**
   - Add a `CNAME` record pointing `@` (or `www`) to `<project-name>.pages.dev` (Cloudflare) or `cname.vercel-dns.com` (Vercel).
3. **Automatic SSL:** Cloudflare / Vercel automatically issues an SSL certificate (HTTPS) within minutes.

## Consequences
- Total operational infrastructure cost: $0/month (only ~\$10 one-time annual domain registration fee).
- Fast global latency with instant edge response on mobile networks.
- Zero server maintenance, patching, or downtime risk.
