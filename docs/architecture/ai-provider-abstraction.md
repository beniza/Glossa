# AI Provider Abstraction

## Purpose

Glossa uses AI-assisted workflows in places where language generation, analysis, and validation can improve speed and consistency.

To support these workflows without tying the product to a single model vendor, Glossa defines a provider abstraction layer between product features and external AI services.

This document describes the role of that abstraction, the design intent behind it, and the boundaries it must preserve.

## Why This Exists

AI providers differ in model behavior, request formats, response formats, safety controls, pricing, and operational constraints.

Without an abstraction layer, those differences leak directly into product code. Over time, that creates unnecessary coupling, makes provider changes expensive, and weakens the reliability of AI-assisted features.

Glossa isolates provider-specific behavior so the product can:

- Support more than one AI provider
- Swap or compare models without rewriting feature logic
- Keep prompt workflows consistent at the product layer
- Handle provider-specific failures without distorting the user experience

## Design Goal

The abstraction layer should allow Glossa to express AI work in product terms rather than vendor terms.

Product features should be able to request outcomes such as:

- draft translation assistance
- translation review assistance
- validation assistance
- structured analysis
- controlled text transformation

They should not need to know:

- provider-specific payload formats
- endpoint differences
- vendor-specific terminology
- raw response structures

## Core Responsibilities

The provider abstraction is responsible for:

- Accepting a normalized request from the application
- Translating that request into a provider-specific format
- Invoking the selected provider
- Normalizing the response into a stable application-facing result
- Surfacing usage, finish state, and failure information in a consistent form

## Adapter Model

Each provider is implemented as an adapter behind a shared internal contract.

Initial provider targets:

- OpenAI
- Gemini

Each adapter is responsible for mapping the shared contract into the provider's native API shape and mapping results back into the shared response shape.

## What Must Be Standardized

The shared contract should standardize:

- task intent
- prompt inputs
- optional system guidance
- model selection
- temperature or equivalent control settings
- output limits
- structured metadata
- normalized result text
- usage reporting
- finish reasons
- normalized error categories

This standardization should be sufficient for product features to behave consistently even when the backing provider changes.

## What Must Remain Provider-Specific

The abstraction should not pretend all providers are identical.

Provider-specific concerns remain inside the adapters, including:

- endpoint formats
- authentication details
- vendor-specific request fields
- native safety settings
- raw response objects
- provider-specific retry or rate-limit behavior

The goal is not to erase differences. The goal is to contain them.

## Product Principles For AI Use

AI assistance in Glossa should follow these rules:

### AI supports workflow, not authority

Model output assists human work and validation workflows. It does not replace review responsibility.

### Deterministic checks remain first-class

Where structural or rules-based validation is possible, Glossa should preserve deterministic validation instead of replacing it with probabilistic judgment.

### Provider choice should not distort product behavior

Users should experience consistent workflows even if the underlying provider changes.

### Failures must degrade clearly

If an AI provider is unavailable, rate-limited, or returns unusable output, the system should fail in a way that is visible and recoverable.

## Initial Boundary

In the first phase, the abstraction layer is intended to support a small number of clearly defined AI-assisted workflows rather than a general-purpose prompt surface for every feature.

This keeps the contract narrow, understandable, and testable.

Initial categories include:

- drafting assistance
- review assistance
- validation assistance
- structured analysis assistance

## Non-Goals

This abstraction is not intended to be:

- a universal prompt playground
- a thin pass-through wrapper around vendor SDKs
- a guarantee that all providers produce identical outputs
- a substitute for deterministic validation logic
- an excuse to let provider details leak upward into product features

## Direction

Glossa treats AI as a bounded capability within a larger translation system.

The provider abstraction exists to keep that capability portable, controlled, and understandable as the product grows.