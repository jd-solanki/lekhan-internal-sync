# Polar API Guide

## URL Conventions

If we're forwarding API responses from the Polar SDK (like list products) then as a convention we'll follow same endpoint URL Polar uses in their API except versioning.

Polar SDK: `polarClient.products.list({ isArchived: false })`
Polar API: `https://api.polar.sh/v1/products?is_archived=false`
Our Endpoint: `https://localhost:3000/products?is_archived=false` (Just remove `/v1` versioning)

## Why not directly use polarClient in `pages/`?

As `polarClient` is server entity and contains sensitive information so it can't be used on the client-side directly.
