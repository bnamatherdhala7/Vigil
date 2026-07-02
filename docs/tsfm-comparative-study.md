# Time Series Foundation Models — Comparative Study

**As of July 2026 | Sources: HuggingFace model cards, arXiv papers, company blogs, GIFT-Eval leaderboard**

---

## Executive Summary Table

| Model | Company | Latest Version | Params | Architecture | Open Source | Primary Use Case | GIFT-Eval Rank |
|---|---|---|---|---|---|---|---|
| **Chronos-2** | Amazon | Oct 2025 | 8M–710M | Encoder-decoder (T5) | ✅ Apache 2.0 | General (finance, retail, IoT) | **#1** (79.8% win rate) |
| **TimesFM 2.5** | Google | Sep 2025 | 200M | Decoder-only (patched) | ✅ Apache 2.0 | General, cloud infra | **#2** |
| **Toto 2.0** | Datadog | Apr 2026 | 4M–2.5B | Decoder-only (factorized space-time) | ✅ Apache 2.0 | Observability / AIOps | **#3** |
| **Moirai 2.0** | Salesforce | Aug 2025 | 14M–311M | Decoder-only transformer | ✅ Apache 2.0 (code) / CC-BY-NC-4.0 (weights) | General enterprise | **#5–6** |
| **Cisco TSFM** | Cisco/Splunk | Nov 2025 | 500M | Decoder-only (multiresolution) | ✅ Apache 2.0 | Network/IT observability | Not ranked |
| **Cisco APEX** | Cisco Research | Jun 2026 | 269M / 10.5M | Decoder-only (channel-dep.) | Research only | Wireless AP telemetry | Not ranked |
| **Time-MoE** | Princeton/Squirrel AI | ICLR 2025 | 2.4B total (1.1B active) | Decoder-only + sparse MoE | ✅ Apache 2.0 | General zero-shot | Top tier |
| **TimeGPT** | Nixtla | 2024+ | Undisclosed | Encoder-decoder | ❌ API only | Retail, energy, finance | Not on leaderboard |
| **MOMENT** | CMU Auton Lab | ICML 2024 | 385M | T5 encoder (masked) | ✅ MIT | Multi-task research | ICML 2024 |
| **TiDE** | Google Research | 2023 | Small (per-dataset) | Pure MLP | ✅ Apache 2.0 | Long-horizon + covariates | N/A (supervised) |
| **Lag-Llama** | Academic | Feb 2024 | 2.45M | Decoder-only (lag features) | ✅ Apache 2.0 | Probabilistic few-shot | Lower tier |
| **ElasTST** | Microsoft Research Asia | NeurIPS 2024 | — | Encoder-only (non-autoregressive) | ✅ (github.com/microsoft/ProbTS) | Horizon-elastic supervised | N/A |

---

## GIFT-Eval Leaderboard (Latest, ~Q4 2025)

> GIFT-Eval: 55 real-world datasets, 97 test cases, multi-domain

| Rank | Model | Win Rate | Skill Score (WQL) |
|---|---|---|---|
| 1 | **Chronos-2** (Amazon) | 79.8% | 46.6% |
| 2 | **TimesFM 2.5** (Google) | 77.5% | — |
| 3 | **Toto 1.0** (Datadog) | 60.9% | 41.9% |
| 4 | TiRex / FlowState | — | — |
| 5–6 | **Moirai 2.0** (Salesforce) | 56.0% | 40.9% |
| Lower | Lag-Llama, MOMENT | — | — |

---

## ETTh1 H=96 Comparison (MSE — one common benchmark)

| Model | ETTh1 H=96 MSE | Evaluation Type |
|---|---|---|
| **TiDE** | **0.375** | Supervised (full fine-tune) |
| PatchTST | 0.379 | Supervised (full fine-tune) |
| MOMENT-LP | 0.387 | Linear probe (frozen backbone) |
| Moirai-Small (zero-shot) | 0.400 | Zero-shot |
| TimesFM 1.0 (zero-shot) | ~0.394 avg | Zero-shot |
| Time-MoE Ultra (zero-shot) | 0.412 avg | Zero-shot |
| Chronos-Large (zero-shot) | ~0.45+ | Zero-shot |
| TimeGPT | Not reported | — |
| Lag-Llama | Not reported | CRPS metric only |

---

## Deep-Dive: Model by Model

---

### 1. Cisco Time Series Model (TSFM) v1.0-preview
**arXiv: 2511.19841 | Released: Nov 2025 | [HuggingFace](https://huggingface.co/cisco-ai/cisco-time-series-model-1.0-preview) | [GitHub](https://github.com/splunk/cisco-time-series-model)**

#### Architecture
- 50 decoder-only transformer layers, **500M parameters**
- **Novel multiresolution design**: splits context into two streams
  - Coarse tokens: older history aggregated at 60× fine resolution (e.g., hourly aggregates ~21 days back)
  - Fine tokens: recent data at native resolution (e.g., last 512 minutes at 1-min resolution)
  - Special separator token between the two streams
- **Resolution Embeddings** replace positional embeddings — one vector for all coarse tokens, another for all fine tokens
- Input: up to **30,720 raw points** (512 coarse + 512 fine with 60:1 ratio)
- Output: 128-point probabilistic forecast, quantiles 0.1–0.9 (MSE + quantile composite loss)
- Initialized from Google TimesFM 2.0 weights — continued pre-training, not from scratch

#### Training Data
| Source | Share |
|---|---|
| Splunk Observability Cloud metrics (1-min) | ~35% |
| Splunk Observability Cloud metrics (5-min) | ~16.5% |
| GIFT-Eval pretraining corpus | ~29.5% |
| Chronos dataset collection | ~4.5% |
| Synthetic KernelSynth multiresolution series | ~14.5% |

Total: **>300 billion data points** from ~400M time series (6 months of production infra)

#### Benchmark
| Model | MAE (proprietary 1-min observability test) |
|---|---|
| **Cisco TSFM** | **0.4788** |
| TimesFM 2.5 | 0.6265 |
| Chronos-2 | higher |

~24% improvement over best general-purpose model on observability data. On GIFT-Eval: MAE 0.6980 (roughly on par with SOTA general models).

#### Honest Caveats
- Quantile calibration (0.1–0.9) explicitly flagged as **unverified** in the technical report
- v1.0 full release + public observability benchmark promised early 2026; still in preview
- No multivariate or classification support in preview
- Available via Splunk DSDL with `tsfm_forecast.ipynb` notebook

#### What Cisco Does Differently
The only model explicitly designed for IT observability machine data — CPU spikes, network throughput, packet loss. The bimodal multiresolution architecture bakes in the structure of observability data: slow seasonal drift (coarse) + fast operational spikes (fine). Every other model treats all time series equally.

---

### 2. Cisco APEX
**arXiv: 2606.11553 | Released: Jun 2026 | Cisco Research (research paper, no open weights)**

Cisco's second time series model — purpose-built for wireless enterprise access point (AP) telemetry.

#### Architecture

| Variant | Layers | Hidden Dim | Heads | FFN Dim | Params |
|---|---|---|---|---|---|
| APEX-Large | 16 | 1,024 | 16 | 4,096 | 269M |
| APEX-Edge | 10 | 256 | 4 | 1,024 | **10.5M** |

- Decoder-only patched transformer, 16-step patches, SwiGLU activations
- **Channel-dependent multivariate** (10 channels: 5 DHCP target + 5 exogenous signals)
- **MC-dropout** for uncertainty → drives anomaly detection confidence intervals
- Instance normalization

#### Training Data
- ~100K access point time series across ~4,500 production wireless networks
- 34 metrics per AP: DHCP protocol, RF, interface error, topology
- 30-minute granularity; context: 2,048 steps (128 patches × 16 = ~42 days)

#### Anomaly Detection (native — unique in this landscape)
- **Univariate**: MC-dropout intervals + Z-score + Isolation Forest
- **Multivariate**: joint prediction intervals + VAR with Mahalanobis distance
- Ground truth: consensus labeling (≥3 independent methods must agree)
- F1: APEX-Large **0.93** (precision 0.93, recall 0.94)

#### Benchmark vs. Other Foundation Models (192-step DHCP_SUCCESS_RATE, MAE)
| Model | MAE |
|---|---|
| **APEX-Large** | **2.98** |
| Toto 1.0 | 3.64 |
| SARIMA | 4.82 |
| **APEX-Edge** | **3.87** — matches Toto at 26× fewer params |

#### What Makes APEX Unique
- **Edge deployable**: sub-second inference on ARM Cortex-A76; APEX-Edge runs on Raspberry Pi 5 (~40MB, 428MB peak memory). No other TSFM targets edge network hardware.
- Generic foundation models transfer poorly to wireless telemetry (bursty, zero-inflated, protocol-layer coupled). APEX pre-trains on the causal chain: DHCP → RF → interface error → topology.

---

### 3. Salesforce Moirai
**arXiv: 2402.02592 | ICML 2024 (Oral) | [GitHub](https://github.com/SalesforceAIResearch/uni2ts)**

**License note**: Code is Apache-2.0, but **model weights are CC-BY-NC-4.0** (non-commercial).

#### Architecture Evolution

| Version | Architecture | Key Change |
|---|---|---|
| Moirai 1.0 (May 2024) | **Encoder-only** transformer, masked prediction | Universal forecasting, any-variate |
| Moirai-MoE (Oct 2024) | Encoder + Sparse MoE | Token-level specialization, no frequency heuristics |
| Moirai 2.0 (Aug 2025) | **Decoder-only** (autoregressive) | 44% faster, 96% smaller, #1 MASE on GIFT-Eval at launch |

#### Moirai 1.x Architecture (precise)
- Pre-training: Masked patch prediction — 15% of patches masked (BERT-style, not causal)
- Patch sizes: **five separate linear projectors** for `{8, 16, 32, 64, 128}` time steps, selected by frequency
- Any-variate attention formula:
  ```
  E_{ij,mn} = (W^Q x_{i,m})ᵀ R_{i−j} (W^K x_{j,n}) + u⁽¹⁾·𝟙{m=n} + u⁽²⁾·𝟙{m≠n}
  ```
  R_{i−j} = RoPE (temporal distance); u⁽¹⁾, u⁽²⁾ = learnable scalars for same/cross-variate
- Output: Mixture of **4 distributions**: Student's t, log-normal, negative binomial, low-variance normal

#### Moirai 1.x Exact Model Configs
| Variant | Layers | d_model | d_ff | Heads | Params | Effective Context |
|---|---|---|---|---|---|---|
| Small | 6 | 384 | 1,536 | 6 | 14M | ~5,000 steps |
| Base | 12 | 768 | 3,072 | 12 | 91M | ~5,000 steps |
| Large | 24 | 1,024 | 4,096 | 16 | 311M | ~5,000 steps |

#### LOTSA Training Data (precise)
- **27.6 billion observations** from **105 open-source datasets**

| Domain | Obs | % |
|---|---|---|
| Energy | 16.36B | **59.2%** |
| Transport | 4.90B | 17.7% |
| Climate | 4.19B | 15.2% |
| CloudOps | 1.52B | 5.5% |
| Web | 0.43B | 1.6% |
| Sales/Finance/Healthcare | <0.02B each | <0.1% |

> Note: "climate is 90% of LOTSA" is wrong. Energy dominates at 59%.

#### Moirai 2.0 Architectural Pivot (Nov 2024)
| Dimension | Moirai 1.x | Moirai 2.0 |
|---|---|---|
| Architecture | Encoder-only (masked) | Decoder-only (autoregressive) |
| Patch sizes | Multi {8,16,32,64,128} | Single patch |
| Output head | Mixture of 4 distributions | 9 quantile levels (0.1–0.9) |
| Loss computed on | 15% masked tokens | All T-1 tokens |
| Training data | 27.6B obs (LOTSA) | 295B obs (30M Chronos-Mixup + 1M KernelSynth + Salesforce CloudOps) |
| Multivariate | Any-variate joint | Independent per variate |
| KV caching | No | Yes (4–17× speedup) |
| Params | 14/91/311M | 11.4/87.1/305M |

GIFT-Eval: Moirai 2.0 ranks 5th (MASE), 6th (CRPS) among 30 pretrained models — 30× smaller, 2× faster than Moirai 1.0 Large.

---

### 4. Amazon Chronos / Chronos-2
**arXiv: 2403.07815 | TMLR Oct 2024 | [GitHub](https://github.com/amazon-science/chronos-forecasting) | Apache 2.0 (code + weights)**

#### Architecture
Standard T5 (encoder-decoder) — **zero changes** to the Transformer. Innovation is entirely in the tokenization layer. Vocabulary: T5's 32,128 → **4,096 bins**.

#### Tokenization — the exact algorithm
1. **Mean Absolute Scaling**: `x̃ᵢ = xᵢ / s`, where `s = (1/C) Σ|xᵢ|` over context C
2. **Uniform Quantization**: Map to **4,096 bins** uniformly spaced in **[−15, +15]**; each observation → 1 discrete token
3. At inference: token IDs → bin centers → unscale

**No patching**: 1 token = 1 raw time step. Context: 512 steps (vs. Moirai's effective ~5,000).

#### Model Sizes
| Variant | Params |
|---|---|
| Tiny | 8M |
| Mini | 20M |
| Small | 46M |
| Base | 200M |
| Large | 710M |

#### Synthetic Data
- **KernelSynth**: 1M series — random GP kernel combinations (RBF, periodic, linear)
- **TSMixup**: 10M series — convex combinations of k~U{1,3} real series with Dirichlet(α) weights
- Training ratio: **9:1 real:synthetic**

#### Chronos-Bolt (Nov 2024)
Distilled architecture: **250× faster**, **20× more memory-efficient**, 5% lower error vs. original Chronos.

#### Chronos-2 (Oct 2025, arXiv: 2510.15821)
| Feature | Chronos 1.x | Chronos-2 |
|---|---|---|
| Variate support | Univariate only | Univariate + multivariate + covariates |
| Group attention | No | Yes (cross-series info sharing at each patch index) |
| Quantile levels | 9 | **21** |
| Scaling | Mean absolute | **sinh⁻¹ transform** (robust to outliers) |
| Position embed | T5 relative bias | **RoPE** |
| Context length | 512 | **8,192** (two-stage: 2,048 → 8,192) |
| Params | 8M–710M | 28M (small) / 120M (base) |
| GIFT-Eval WQL win rate | — | **81.9%** vs TimesFM-2.5 77.5% |
| fev-bench win rate | — | **90.7%** vs TiRex 80.8% |

Available on AWS SageMaker JumpStart and AutoGluon-Cloud (3-line deployment).

---

### 5. Google TimesFM 2.0 / 2.5
**arXiv: 2310.10688 | ICML 2024 | [GitHub](https://github.com/google-research/timesfm) | Apache 2.0**

#### Architecture Evolution
| Version | Params | Context | Layers | Notes |
|---|---|---|---|---|
| 1.0 | 200M | 512 | 20 | Decoder-only, RoPE, patched, ICML 2024 |
| 2.0 | 500M | 2,048 | 50 | LOTSA + cloud traces |
| 2.5 | 200M | **16,384** | — | Smaller, covariate support (XReg), LoRA fine-tuning |

#### Core Architecture (all versions)
- **Decoder-only** causal transformer
- **Patch-based**: Input patches of **32 time steps**, output patches of **128 time steps** (asymmetric — reduces autoregressive steps at inference)
- Each patch → dense embedding via residual MLP block
- **No positional embeddings** in v2.0 (disabled); v1.0 uses positional encodings
- Frequency conditioning: categorical indicator (0=high/daily+, 1=medium/weekly-monthly, 2=low/quarterly-yearly)

#### v2.0 config (precise)
- Layers: 50, Model dim: 1,280, Params: 500M

#### Training Data
- v1.0: 100B time points — Google Trends, Wikipedia pageviews, M4, Electricity, Traffic, Weather + synthetic (50/50 mix)
- v2.0: Above + LOTSA (15+ additional sources: cloud traces, power grids, ERA5 weather, air quality, traffic)
- v2.5: Expanded; 16K context via extended training

#### What Google Does Differently
The **32-in/128-out patch asymmetry** is unique — 4× compression ratio means each decode step covers 128 raw points. TimesFM 2.5 made the counterintuitive choice to shrink parameters (500M→200M) while expanding context 8× — "less is more" validated by GIFT-Eval #1. Deeply integrated with Google Cloud: BigQuery ML, Vertex AI, AlloyDB, Google Sheets.

---

### 6. Datadog Toto 1.0 / 2.0
**arXiv: 2407.07874 | NeurIPS 2025 | [HuggingFace](https://huggingface.co/Datadog/Toto-Open-Base-1.0) | [GitHub](https://github.com/datadog/toto) | Apache 2.0**

#### Toto 1.0 Architecture (precise)
- 151M params, decoder-only transformer
- Embedding dim D=768, context L=4,096, patch size P=64
- **11 time-wise blocks + 1 variate-wise block** (11:1 ratio) — "Proportional Factorized Space-Time Attention"
  - Time-wise: temporal dependencies within each variate
  - Variate-wise: cross-variate correlations
- **RMSNorm** pre-norm, **SwiGLU** FFN, **RoPE + XPOS** (improved long-context extrapolation)
- **Student-T Mixture Model (SMM) prediction head** — handles heavy-tailed observability distributions (latency spikes, traffic bursts) better than Gaussian
- **Patch-based causal instance normalization** using Welford's online algorithm O(n) — preserves causality
- **Composite robust loss**: NLL + Cauchy loss (α=0, δ=0.1, λ_NLL=0.57)

#### Training Data (precise)
| Source | Share |
|---|---|
| Datadog internal observability (anonymous) | **43%** |
| GIFT-Eval Pretrain + Chronos collections | Public |
| Synthetic data | ~1/3 |

Total: **2.36 trillion data points** — 4–10× larger than any competing TSFM at time of publication. Internal data is Datadog's own monitoring data, NOT customer data.

**Production caveat**: Toto 1.0 paper explicitly states it was not deployed in production at release. The existing production Watchdog uses classical SARIMA/STL/DBSCAN. Toto integration is in progress.

#### Toto 1.0 Benchmarks
| Benchmark | CRPS | MASE |
|---|---|---|
| BOOM (Datadog's observability benchmark) | 0.375 | 0.617 |
| GIFT-Eval | 0.517 | 0.750 |

BOOM: 350M observations across 2,807 real-world multivariate series — Datadog's own benchmark, more representative of observability data than ETT/M4.

#### Toto 2.0 (Apr 2026) — Scaling Laws Proven
| Size | Params |
|---|---|
| Toto-2.0-4m | 4M |
| Toto-2.0-22m | 22M |
| Toto-2.0-313m | 313M |
| Toto-2.0-1B | 1B |
| Toto-2.0-2.5B | **2.5B** |

Key innovations:
- **Continuous Patch Masking (CPM)**: single-pass parallel forecasting (replaces sequential autoregressive decoding — previously up to 16 steps for 1024-step forecasts)
- **u-μP** (maximal update parameterization): hyperparameter transfer across model sizes — tune once on small, apply to 2.5B
- Optimal training mix **excludes** public forecasting datasets (ETT, M4) entirely — pure observability + synthetic outperforms mixed corpora
- Toto-2.0-22m matches Toto 1.0 (151M) quality — 7× more parameter-efficient
- **First TSFM to demonstrate clean monotonic scaling laws** (4M → 2.5B, no saturation)

---

### 7. Nixtla TimeGPT-1
**arXiv: 2310.03589 | [GitHub SDK](https://github.com/Nixtla/nixtla) | API-only (proprietary weights)**

#### Architecture
Encoder-decoder Transformer. **All architecture details intentionally undisclosed** (parameter count, layers, embedding dims, context window, tokenization).

#### What is confirmed
- Trained on **100B+ data points** across finance, energy, healthcare, weather, IoT, sales, transport
- Pre-training: direct forecast error minimization (loss undisclosed)
- Output: point forecasts + conformal prediction intervals (not parametric distributions)
- Inference speed: **~0.6ms/series** (~100× faster than ARIMA, ~95× faster than deep learning)
- Exogenous variable support, irregular timestamps, multivariate (TimeGPT-2)

#### Benchmark Honesty
TimeGPT-1 paper reports **only on a proprietary held-out test set** — no ETT, M4, or Monash numbers. External evaluations (by MOMENT, Moirai teams) found TimeGPT underperforms Chronos-Large and Moirai on public zero-shot benchmarks.

**Own paper results (rMAE vs. Seasonal Naive = 1.000)**:
| Model | Monthly | Weekly | Daily | Hourly |
|---|---|---|---|---|
| **TimeGPT (zero-shot)** | **0.727** | **0.878** | 0.804 | 0.852 |
| NHITS (supervised) | 0.738 | 0.883 | **0.788** | **0.829** |

#### What TimeGPT Does Differently
The pure SaaS bet: closed weights, managed API, 3-line Python deployment. No self-hosting, no reproducibility — but fastest time-to-value for teams that don't want to manage model infrastructure.

---

### 8. MOMENT (CMU Auton Lab)
**arXiv: 2402.03885 | ICML 2024 | [HuggingFace](https://huggingface.co/AutonLab/MOMENT-1-large) | MIT License**

#### Architecture (precise)
T5 Encoder (bidirectional, BERT-style — NOT autoregressive). Only major TSFM using masked encoder pre-training.

| Variant | Layers | Heads | d_model | d_ff | Params |
|---|---|---|---|---|---|
| Small | 6 | 8 | 512 | 2,048 | ~40M |
| Base | 12 | 12 | 768 | 3,072 | ~125M |
| Large | 24 | 16 | 1,024 | 4,096 | **385M** |

Trained on single RTX A6000, 404 GPU-hours.

#### Patching
512 fixed context → **64 disjoint patches of 8 steps**. Each patch linearly projected to D-dim. Masked patches → learnable `[MASK]` token.

#### Pre-training
**Masked Patch Reconstruction (30% masking)**: bidirectional context, lightweight linear reconstruction head. Self-supervised, no labels. This is BERT-style, not GPT-style.

#### Training Data — Time Series Pile
- LTSF benchmarks: 9 datasets (ETT, Weather, ECL, Traffic, Exchange, ILI)
- Monash Repository: 58+ datasets, 100,000+ series
- UCR/UEA Classification Archive: 159 datasets
- TSB-UAD Anomaly Benchmark: 18 datasets, 1,980 series

#### Benchmarks — All 4 Tasks (unique in this landscape)

**Forecasting** (ETTh1 linear probe, MSE/MAE):
| H=96 | H=192 | H=336 | H=720 |
|---|---|---|---|
| 0.387/0.410 | 0.410/0.426 | 0.422/0.437 | 0.454/0.472 |

**Classification** (zero-shot, 91 UCR datasets):
- Mean accuracy: **79.4%** — best zero-shot result on UCR

**Anomaly Detection** (linear probe, UCR Anomaly Archive, 248 series):
- Adjusted F1: 0.628, VUS-ROC: 0.684

**Imputation** (linear probe, Weather):
- MSE: 0.035 / MAE: 0.075

**M4 short-horizon**: Monthly sMAPE 15.80

Note: MOMENT's linear probe only trains the output head (frozen backbone) while comparing against end-to-end fine-tuned models — a systematically harder evaluation.

---

### 9. Lag-Llama
**arXiv: 2310.08278 | [HuggingFace](https://huggingface.co/time-series-foundation-models/Lag-Llama) | Apache 2.0**

#### Architecture
- Decoder-only transformer, **LLaMA-style** (RMSNorm, RoPE, causal masking)
- **2.45M parameters** — the smallest serious TSFM
- Output head: **Student's t-distribution** (ν degrees of freedom, μ mean, σ scale)

#### Tokenization — frequency-adaptive lag features
At each position t, the input token vector contains:
- Lagged values via `get_lags_for_frequency()` (GluonTS): universal base lags [1–7] + seasonal period lags
- Date-time features: second, minute, hour, day-of-week, day-of-month, day-of-year, month, quarter
- Summary statistics: mean (loc) + IQR-based scale

Context: **32 time steps** (training); RoPE enables generalization beyond 32 at inference (tested 1,024+).

#### Training Data
27 datasets, **7,965 time series**, ~352M tokens — the smallest pre-training corpus of any TSFM.

#### Benchmark (CRPS, 7 datasets)
| Scenario | Avg Rank |
|---|---|
| Lag-Llama zero-shot | 6.714 |
| **Lag-Llama finetuned** | **2.786** |
| **Lag-Llama few-shot (20%)** | **1.857** ← best of all models incl. fully supervised |

Few-shot on 20% of data beats all fully supervised baselines trained on 100%. Key value proposition: **sample-efficient fine-tuning**.

---

### 10. TiDE (Google Research)
**arXiv: 2304.08424 | [GitHub](https://github.com/google-research/google-research/tree/master/tide) | Apache 2.0**

#### Architecture
**Pure MLP encoder-decoder. Zero attention, zero recurrence, zero convolution.** O(L) linear complexity vs Transformer's O(L²).

Core building block:
```
ResidualBlock(x):
  h = ReLU(LayerNorm(Linear_1(x)))
  out = Dropout(Linear_2(h))
  return LayerNorm(out + Linear_skip(x))
```

Four components:
1. **Feature Projection**: Shared-weight MLP compresses r-dim covariates at each of L+H timesteps
2. **Dense Encoder**: Flattens past values + covariates + static attributes → n_e residual blocks → dense embedding
3. **Dense Decoder**: n_d residual blocks → H × p matrix
4. **Temporal Decoder**: Per-timestep residual combining decoder output + future covariate → scalar forecast
5. **Global Skip Connection**: Direct linear projection L past → H future (critical for gradient flow)

Covariate handling: past dynamic + **future dynamic** + **static attributes** — unique advantage over patch transformers.

No pre-training — trained from scratch per dataset.

#### Benchmark (selected, MSE/MAE vs PatchTST)
| Dataset | H=96 | TiDE wins? |
|---|---|---|
| **Traffic** | **0.336/0.253** vs PatchTST 0.360/0.249 | ✅ All horizons |
| **ETTm2** | **0.161/0.251** vs 0.166/0.256 | ✅ All horizons |
| ETTh1 | **0.375/0.398** vs 0.379/0.401 | ✅ Short horizons |

**M5 Competition (WRMSSE)**:
| Model | WRMSSE |
|---|---|
| **TiDE (Static + Dynamic covariates)** | **0.611** |
| DeepAR | 0.789 |
| PatchTST (no covariates) | 0.976 |

Speed: ~5× faster inference, ~10–15× faster training vs PatchTST. At L ≥ 1,440, PatchTST OOMs; TiDE scales linearly.

**The architectural thesis**: For long-horizon forecasting, attention is not needed. An MLP with a global skip connection matches Transformers at a fraction of the compute cost.

---

### 11. Microsoft ElasTST
**arXiv: 2411.01842 | NeurIPS 2024 | [GitHub](https://github.com/microsoft/ProbTS/tree/elastst)**

**Important**: Microsoft does NOT have a flagship zero-shot TSFM. ElasTST is their primary contribution — fundamentally different from TimesFM/Chronos.

#### Architecture
- **Encoder-only** (NOT decoder-only) — non-autoregressive, full forecast in one forward pass
- **Multi-scale patches**: processes `{8, 16, 32}` simultaneously in one pass
- **TRoPE** (Tunable Rotary Position Embedding): learnable period coefficients tuned to P_max~1,000 for time series (vs. NLP default ~10,000)
- **Horizon-invariant masking**: future steps are placeholder tokens that attend to history but NOT each other

#### Key Innovation — Horizon Elasticity
Trained on fixed horizons {96, 192, 336, 720}, generalizes to unseen horizons (e.g., 1,024) via horizon-reweighted loss:
```
ω(τ) ≈ (1/T_max)(ln(T_max) − ln(τ))
```

**NOT a zero-shot model** — supervised per dataset (96-step lookback), not pre-trained on large corpus. Solves: "I need a different horizon in production than I trained for."

Microsoft Azure separately hosts Nixtla's TimeGEN-1 as Model-as-a-Service (not Microsoft's own model).

---

### 12. Time-MoE (Princeton / Squirrel AI)
**arXiv: 2409.16040 | ICLR 2025 Spotlight | [GitHub](https://github.com/Time-MoE/Time-MoE) | Apache 2.0**

Not a company product — academic model, but top-ranked on benchmarks.

| Spec | Value |
|---|---|
| Architecture | Decoder-only + sparse MoE |
| MoE config | 8 non-shared + 1 shared expert; top-2 routing |
| Multi-resolution heads | 4 prediction heads (horizons 1, 8, 32, 64); Huber loss |
| Training data | Time-300B: 309B time points (Nature 90.5%, Energy 5.2%, Synthetic 3%) |
| Context | Up to 4,096 tokens |
| Ultra params | 2.4B total / **1.1B active** (MoE sparsity) |
| ETTh1 zero-shot avg MSE | 0.412 vs TimesFM 0.489 |
| ETTm1 zero-shot avg MSE | 0.356 vs TimesFM 0.386 |

---

## Synthesis: What Each Company Does Differently

| Differentiator | Who | Why It Matters |
|---|---|---|
| **Multiresolution dual-stream context** | Cisco/Splunk (TSFM) | Handles slow trends + fast spikes in one model — critical for network ops |
| **Network-native edge deployment** | Cisco Research (APEX) | Only model running on ARM network hardware at <40MB |
| **Tokenize as language (quantization)** | Amazon (Chronos) | Leverages NLP scaling; pays precision penalty from discretization |
| **Patched decoder (ViT-style, asymmetric 32→128)** | Google (TimesFM) | Best efficiency/accuracy balance; now dominant architecture |
| **Sparse MoE routing** | Salesforce (Moirai-MoE) | Token-level specialization without frequency heuristics |
| **Proportional factorized space-time attention** | Datadog (Toto) | Handles thousands of concurrent metrics at observability scale |
| **Masked encoder pre-training (BERT-style)** | CMU (MOMENT) | Only model equally strong on forecasting + classification + anomaly + imputation |
| **Frequency-adaptive lag features** | Academic (Lag-Llama) | Best few-shot efficiency at 2.45M params |
| **Pure MLP + linear complexity** | Google Research (TiDE) | Proves attention unnecessary for long-horizon; best covariate handling |
| **Horizon elasticity** | Microsoft (ElasTST) | Any inference horizon from a single trained checkpoint |
| **Scaling law proof** | Datadog (Toto 2.0) | First TSFM to show 4M→2.5B clean monotonic improvement |
| **Observability-specialized pre-training** | Cisco + Datadog | Both >50% trained on production operational metrics — outperform general models on AIOps |
| **API-as-product** | Nixtla (TimeGPT) | 3-line deployment, no infra — SaaS bet vs. open-weight trend |

---

## Full Architecture Comparison

| | Cisco TSFM | Cisco APEX-Edge | Datadog Toto 2.0 | Amazon Chronos-2 | Google TimesFM 2.5 | Salesforce Moirai 2.0 | Time-MoE Ultra | Microsoft ElasTST |
|---|---|---|---|---|---|---|---|---|
| **Arch type** | Decoder-only | Decoder-only | Decoder-only | Enc-decoder (T5) | Decoder-only | Decoder-only | Decoder-only + MoE | **Encoder-only** |
| **Params** | 500M | 10.5M | 2.5B | 8M–710M | 200M | 14M–311M | 2.4B (1.1B active) | — |
| **Context** | 30,720 raw pts | 2,048 steps | 4,096 | 2,048→8,192 | **16,384** | ~5,000 (patched) | 4,096 | 96 (fixed) |
| **Patching** | Dual-res (60:1) | 16-step patches | P=64 | Quantized bins (no patch) | 32-in/128-out | Multi {8–128} | Point-level | Multi-scale {8,16,32} |
| **Position embed** | None (resolution embed) | Learned | RoPE + XPOS | RoPE (v2) | None (v2.0) | RoPE | RoPE | TRoPE (learnable period) |
| **Output head** | Quantile 0.1–0.9 | MC-dropout | SMM (Student-T Mixture) | Distribution sampling | Point + quantile | Quantile 0.1–0.9 | Distribution | Deterministic |
| **Anomaly** | Indirect | **Native** | Indirect | Indirect | Indirect | Indirect | Indirect | Indirect |
| **Multivariate** | No (preview) | Yes (10-ch) | Yes (factorized) | Yes (v2) | No | v1: joint; v2: independent | No | Yes |
| **Zero-shot** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | **No** |
| **Edge deploy** | No | **Yes** (ARM) | No | No | No | No | No | No |
| **Training data** | 300B (Splunk infra) | 100K AP series | ~2.36T (43% internal) | Large public corpus | 100B+ pts | 27.6B (LOTSA) | Time-300B: 309B pts | 8 standard datasets |
| **License** | Apache 2.0 | Research only | Apache 2.0 | **Apache 2.0** | Apache 2.0 | Code: Apache / Weights: CC-BY-NC | Apache 2.0 | Apache 2.0 |
| **GIFT-Eval rank** | Not ranked | Not ranked | Top 3 | **#1** | **#2** | #5–6 | Top tier | N/A |

---

## Relevance to Vigil (Cisco/SP AIOps)

For the FSM incident commander on SP/Cisco network telemetry:

| Model | Relevance | Notes |
|---|---|---|
| **Cisco TSFM** | ★★★★★ | Multiresolution designed for SP operational data; direct Splunk DSDL integration path |
| **Cisco APEX** | ★★★★★ | Native anomaly detection relevant to Vigil's ESCALATING state; network-domain specific |
| **Datadog Toto** | ★★★★☆ | Best open alternative for observability; BOOM benchmark mirrors SP data characteristics |
| **Chronos-2** | ★★★☆☆ | SageMaker JumpStart; best GIFT-Eval; multivariate + covariate support useful for topology features |
| **MOMENT** | ★★★☆☆ | Only model with anomaly detection as first-class task (not just forecasting) — relevant for ESCALATING state logic |
| **TimesFM 2.5** | ★★☆☆☆ | General purpose; useful if Google Cloud infra is in scope |
| **TiDE** | ★★☆☆☆ | Best covariate handling; useful if remediation actions are known-future covariates |

---

## Sources

- [Cisco TSFM — Splunk Blog](https://www.splunk.com/en_us/blog/artificial-intelligence/introducing-the-cisco-time-series-model.html)
- [Cisco TSFM Technical Report — arXiv:2511.19841](https://arxiv.org/pdf/2511.19841)
- [Cisco TSFM HuggingFace](https://huggingface.co/cisco-ai/cisco-time-series-model-1.0-preview)
- [Cisco APEX — arXiv:2606.11553](https://arxiv.org/abs/2606.11553)
- [Moirai paper — arXiv:2402.02592](https://arxiv.org/abs/2402.02592) | [ICML 2024](https://proceedings.mlr.press/v235/woo24a.html)
- [Moirai 2.0 — arXiv:2511.11698](https://arxiv.org/html/2511.11698v1)
- [Salesforce Moirai 2.0 Blog](https://www.salesforce.com/blog/moirai-2-0/)
- [Chronos paper — arXiv:2403.07815](https://arxiv.org/abs/2403.07815)
- [Chronos-2 — arXiv:2510.15821](https://arxiv.org/html/2510.15821v1)
- [Chronos GitHub](https://github.com/amazon-science/chronos-forecasting)
- [Google TimesFM GitHub](https://github.com/google-research/timesfm)
- [TimesFM HuggingFace 2.0](https://huggingface.co/google/timesfm-2.0-500m-pytorch)
- [TimesFM 2.5 — MarkTechPost](https://www.marktechpost.com/2025/09/16/google-ai-ships-timesfm-2-5-smaller-longer-context-foundation-model-that-now-leads-gift-eval-zero-shot-forecasting/)
- [Datadog Toto — arXiv:2407.07874](https://arxiv.org/abs/2407.07874)
- [Toto 2.0 — arXiv:2505.14766](https://arxiv.org/abs/2505.14766)
- [Toto HuggingFace](https://huggingface.co/Datadog/Toto-Open-Base-1.0)
- [Toto + BOOM Blog](https://www.datadoghq.com/blog/ai/toto-boom-unleashed/)
- [Toto 2.0 Blog](https://www.datadoghq.com/blog/ai/toto-2/)
- [TimeGPT-1 — arXiv:2310.03589](https://arxiv.org/html/2310.03589v3)
- [Nixtla GitHub](https://github.com/Nixtla/nixtla)
- [MOMENT — arXiv:2402.03885](https://arxiv.org/abs/2402.03885)
- [MOMENT HuggingFace](https://huggingface.co/AutonLab/MOMENT-1-large)
- [Lag-Llama — arXiv:2310.08278](https://arxiv.org/html/2310.08278v3)
- [Lag-Llama HuggingFace](https://huggingface.co/time-series-foundation-models/Lag-Llama)
- [TiDE — arXiv:2304.08424](https://arxiv.org/html/2304.08424v4)
- [TiDE GitHub](https://github.com/google-research/google-research/tree/master/tide)
- [ElasTST — arXiv:2411.01842](https://arxiv.org/abs/2411.01842)
- [Microsoft ProbTS](https://github.com/microsoft/ProbTS)
- [Time-MoE — arXiv:2409.16040](https://arxiv.org/abs/2409.16040)
- [Time-MoE GitHub](https://github.com/Time-MoE/Time-MoE)
- [GIFT-Eval benchmark comparison](https://paperswithbacktest.com/course/timesfm-vs-chronos-vs-moirai)
- [TimeGEN-1 on Azure](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/announcing-timegen-1-in-azure-ai-leap-forward-in-time-series-forecasting/4140446)
