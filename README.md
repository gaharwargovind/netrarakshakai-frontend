<div align="center">

🔬 NetraRakshakAI

Explainable AI for Diabetic Retinopathy Screening in Rural India

An AI-assisted retinal screening research platform designed to bring quality-gated, explainable diabetic retinopathy assessment closer to underserved communities.

<p>
  <img src="https://img.shields.io/badge/Project-Healthcare%20AI-0D9488?style=for-the-badge" alt="Healthcare AI">
  <img src="https://img.shields.io/badge/AI-Computer%20Vision-2563EB?style=for-the-badge" alt="Computer Vision">
  <img src="https://img.shields.io/badge/Explainability-Grad--CAM-7C3AED?style=for-the-badge" alt="Grad-CAM">
  <img src="https://img.shields.io/badge/Platform-Research%20Prototype-F59E0B?style=for-the-badge" alt="Research Prototype">
</p>
<p>
  <strong>Project:</strong> NetraRakshakAI
  &nbsp; | &nbsp;
  <strong>Hackathon PS ID:</strong> SIH26038
  &nbsp; | &nbsp;
  <strong>Domain:</strong> Healthcare / MedTech
</p>

Quality before prediction. Evidence before confidence. Human oversight before clinical decisions.

</div>

⸻

📑 Table of Contents

* 1. Project Overview
* 2. The Problem
* 3. Our Vision and Objectives
* 4. Proposed Solution
* 5. System Architecture
* 6. Complete Screening Workflow
* 7. AI and Machine Learning Pipeline
* 8. Dataset Strategy and Data Integrity
* 9. Experimental Research
* 10. Explainable AI
* 11. Image Quality Assessment
* 12. Confidence Calibration and Uncertainty
* 13. External Validation and Safety
* 14. Frontend and User Experience
* 15. Backend and API
* 16. Screening Reports
* 17. Technology Stack
* 18. Repository Structure
* 19. Installation and Setup
* 20. Running the Application
* 21. API Reference
* 22. Evaluation Metrics
* 23. Reproducibility and Experiment Tracking
* 24. Security and Data Privacy
* 25. Limitations and Known Risks
* 26. Research Roadmap
* 27. Contributing
* 28. References and Resources
* 29. Team and Acknowledgements
* 30. Disclaimer

⸻

🔬 1. Project Overview

NetraRakshakAI is an AI-assisted diabetic retinopathy (DR) screening research platform that combines retinal image quality assessment, deep-learning-based severity grading, model attribution, confidence calibration, and structured referral workflows.

The project is designed around an important principle:

A screening system must do more than predict a class. It must also assess image suitability, communicate uncertainty, expose relevant model evidence, and provide a safe pathway when automated assessment is insufficient.

The platform combines a Python-based computer vision backend with a React frontend intended to support a primary healthcare centre (PHC)-oriented screening workflow.

The current research prototype includes:

* Five-class diabetic retinopathy grading using the International Clinical Diabetic Retinopathy Disease Severity Scale.
* Deterministic retinal image quality assessment.
* A quality-gated inference pipeline.
* Grad-CAM model-attribution visualization.
* Temperature-scaled model probabilities.
* Referable DR triage based on predicted ICDR severity.
* Structured screening reports.
* A FastAPI inference service.
* A React-based screening interface.
* Dataset auditing and duplicate analysis.
* Controlled model experiments.
* Synthetic image-perturbation robustness testing.
* External evaluation using the IDRiD grading dataset.

The current implementation is a research prototype, not a clinically validated medical device.

<div align="center">

Core capability	Research purpose
🖼️ Image Quality	Determine whether an image passes the current technical quality gate
🧠 AI Grading	Estimate DR severity across five ICDR classes
🔥 Explainability	Visualize model attribution using Grad-CAM
📊 Calibration	Adjust predicted probability distributions using temperature scaling
🚦 Triage	Route outputs toward specialist assessment, recapture, or further review
📄 Reporting	Generate structured screening output and model provenance

</div>

⸻

🩺 2. The Problem

Diabetic retinopathy is a diabetes-related retinal complication that can threaten vision. Early detection and appropriate follow-up are important, but access to retinal screening and specialist assessment can be challenging in underserved communities.

A screening workflow may encounter several interconnected problems.

2.1 Limited access to specialist assessment

Patients may have to travel substantial distances to access appropriate eye-care services.

2.2 Poor-quality retinal images

Blur, inadequate exposure, incomplete retinal coverage, and low contrast can compromise the usefulness of fundus images.

2.3 Inconsistent interpretation of screening results

A prediction without supporting context may be difficult for frontline staff to interpret responsibly.

2.4 Limited transparency of AI predictions

A model may produce a severity grade without showing what parts of the image influenced its prediction.

2.5 Domain generalization

A model that performs well on one dataset may perform substantially worse on images from another source, camera, or acquisition environment.

2.6 Unsafe automation

A screening system must have a defined response when image quality is insufficient, model output is uncertain, or further assessment is required.

NetraRakshakAI investigates these problems through a quality-gated and explainable screening workflow.

⸻

🎯 3. Our Vision and Objectives

Vision

To investigate a practical, explainable, and auditable AI-assisted retinal screening workflow that can support earlier identification of potentially referable diabetic retinopathy in resource-constrained settings.

Primary objectives

1. Image quality assessment: Detect technical image-quality problems before automated grading.
2. Five-class severity grading: Estimate the DR severity represented in a retinal fundus image.
3. Referable DR triage: Identify model predictions corresponding to ICDR Grade 2 or higher.
4. Explainability: Generate Grad-CAM visualizations to help users inspect model attribution.
5. Confidence calibration: Investigate the reliability of model probability estimates.
6. Human oversight: Provide recapture and review pathways instead of treating every prediction as definitive.
7. External evaluation: Investigate generalization beyond the development dataset.
8. Structured reporting: Record results, quality measurements, and model provenance.
9. Operational feasibility: Investigate deployment, processing capacity, and workflow requirements.
10. Reproducibility: Preserve experiment configurations, dataset splits, checkpoints, and evaluation evidence.

Design principles

* Quality assessment precedes inference.
* Model attribution is not treated as definitive lesion identification.
* Development performance is not confused with external validation.
* An ungradable image is not assigned an automated disease grade.
* Non-referable predictions are not presented as proof that disease is absent.
* Experimental thresholds are not presented as clinically validated cutoffs.
* New model versions must be evaluated rather than assumed to be better.

⸻

💡 4. Proposed Solution

NetraRakshakAI combines several components into a single workflow.

flowchart TD
    A["🧑 Patient Registration"] --> B["🖼️ Fundus Image Acquisition"]
    B --> C["🔍 Image Quality Assessment"]
    C -->|Quality Gate Pass| D["⚙️ Image Preprocessing"]
    C -->|Quality Gate Fail| E["🔄 Recapture / Human Review"]
    D --> F["🧠 Five-Class DR Grading"]
    F --> G["📊 Probability Calibration"]
    G --> H["🔥 Grad-CAM Attribution"]
    H --> I{"Predicted ICDR Grade"}
    I -->|Grade 0 or 1| J["Routine Monitoring Pathway"]
    I -->|Grade 2, 3 or 4| K["Specialist Assessment Recommended"]
    J --> L["📄 Structured Screening Report"]
    K --> L
    E --> M["Human Assessment / Recapture Outcome"]
    L --> N["Qualified Clinical Interpretation"]
    classDef ai fill:#172554,stroke:#60A5FA,color:#FFFFFF
    classDef safety fill:#422006,stroke:#F59E0B,color:#FFFFFF
    classDef result fill:#064E3B,stroke:#34D399,color:#FFFFFF
    class F,G,H ai
    class C,E,M safety
    class J,K,L,N result

Why this design matters

A conventional image classifier can return a predicted grade. Our system adds supporting infrastructure around that prediction:

* A technical quality gate.
* A preprocessing pipeline.
* A calibrated probability distribution.
* An attribution visualization.
* A defined triage outcome.
* A report containing model provenance.
* A human-review pathway.

These components do not, by themselves, establish clinical safety. Each requires appropriate validation.

⸻

🏗️ 5. System Architecture

NetraRakshakAI uses a modular architecture that separates the user interface from the inference service.

flowchart TB
    subgraph CLIENT["Presentation Layer"]
        UI["React Frontend"]
        PATIENT["Patient / Screening Information"]
        IMAGE["Image Upload"]
        RESULTS["Results and Explainability"]
        REPORT["Report Interface"]
    end
    subgraph API["Application Layer"]
        FASTAPI["FastAPI REST API"]
        VALIDATION["Request Validation"]
        ROUTING["Screening Orchestration"]
    end
    subgraph INFERENCE["AI Inference Layer"]
        IQA["E013 Quality Gate"]
        TRANSFORM["Canonical Image Transform"]
        MODEL["Frozen E007 EfficientNet-B0"]
        CAL["Temperature Scaling"]
        CAM["Grad-CAM"]
        TRIAGE["Rule-Based Triage"]
    end
    subgraph OUTPUT["Output Layer"]
        JSON["Structured JSON Response"]
        ARTIFACTS["Temporary Screening Artifacts"]
        PDF["PDF / Text Report"]
    end
    UI --> FASTAPI
    PATIENT --> UI
    IMAGE --> UI
    RESULTS --> UI
    REPORT --> UI
    FASTAPI --> VALIDATION
    VALIDATION --> ROUTING
    ROUTING --> IQA
    IQA -->|Pass| TRANSFORM
    IQA -->|Fail| JSON
    TRANSFORM --> MODEL
    MODEL --> CAL
    CAL --> CAM
    CAM --> TRIAGE
    TRIAGE --> JSON
    CAM --> ARTIFACTS
    JSON --> PDF
    JSON --> UI
    ARTIFACTS --> UI
    classDef frontend fill:#1E3A8A,stroke:#60A5FA,color:#FFFFFF
    classDef backend fill:#064E3B,stroke:#34D399,color:#FFFFFF
    classDef model fill:#4C1D95,stroke:#C4B5FD,color:#FFFFFF
    classDef output fill:#78350F,stroke:#FBBF24,color:#FFFFFF
    class UI,PATIENT,IMAGE,RESULTS,REPORT frontend
    class FASTAPI,VALIDATION,ROUTING backend
    class IQA,TRANSFORM,MODEL,CAL,CAM,TRIAGE model
    class JSON,ARTIFACTS,PDF output

Architectural responsibilities

Layer	Responsibilities
Presentation	Patient information, image upload, screening stages, results, explanation, and report interaction
Application	API routing, input validation, request handling, and response serialization
Quality assessment	Image-quality feature extraction and deterministic pass/fail decision
Preprocessing	Retinal-field handling, resizing, and normalization
Inference	Five-class prediction using the frozen E007 checkpoint
Calibration	Temperature scaling of model logits
Explainability	Grad-CAM generation
Triage	Mapping quality and predicted grade to workflow actions
Reporting	Structured output, model provenance, and report generation

The React frontend and Python backend are maintained separately.

The frontend communicates with the backend through HTTP requests. Medical inference is performed by the Python service rather than by the frontend or a generative AI API.

⸻

🔄 6. Complete Screening Workflow

The workflow is divided into explicit stages.

Stage	Operation	Expected outcome
1	Patient or screening record creation	Screening context established
2	Fundus image upload	Image received by the backend
3	Input validation	File type, size, and decoding checked
4	Image quality assessment	Image passes or fails the current quality gate
5	Preprocessing	Image transformed into the model’s expected input
6	DR grading	Five-class probability distribution generated
7	Probability calibration	Temperature scaling applied
8	Explainability	Grad-CAM generated when available
9	Triage	Workflow recommendation generated
10	Report generation	Screening output and provenance recorded
11	Human interpretation	Qualified personnel determine appropriate next steps

Quality-gate behaviour

If the image fails the current quality gate:

* Automated classification is skipped.
* A quality failure response is returned.
* The workflow directs the case toward recapture or human review.

The quality gate is a preliminary engineering mechanism. Its ability to identify clinically ungradable images has not yet been established through a dedicated clinical gradability study.

Triage behaviour

The current system uses the following general routing logic:

Condition	Current workflow action
Image quality fails	RECAPTURE_OR_HUMAN_REVIEW
Predicted ICDR Grade ≥ 2	SPECIALIST_REFERRAL
Predicted ICDR Grade < 2	ROUTINE_MONITORING
Low-confidence non-referable prediction	Human-review logic may apply under the current engineering policy

Important: the low-confidence threshold is an experimental engineering placeholder. Current triage ordering does not guarantee that every low-confidence referable prediction is overridden by the human-review rule.

This policy requires further review before clinical use.

⸻

🧠 7. AI and Machine Learning Pipeline

7.1 Classification task

The current classifier predicts one of five ICDR severity grades.

Grade	Severity category	Interpretation
0	No DR	No diabetic retinopathy represented by the reference grade
1	Mild NPDR	Mild non-proliferative diabetic retinopathy
2	Moderate NPDR	Moderate non-proliferative diabetic retinopathy
3	Severe NPDR	Severe non-proliferative diabetic retinopathy
4	PDR	Proliferative diabetic retinopathy

These categories follow the ICDR severity framework. They are not a substitute for a complete clinical examination.

7.2 Current model

The reference model is E007, a pretrained EfficientNet-B0 adapted for five-class classification.

Property	Current configuration
Architecture	EfficientNet-B0
Classification classes	5
Input resolution	512 × 512
Loss	Multiclass focal loss
Focal gamma	2.0
Focal alpha	1.0
Optimizer	AdamW
Initial learning rate	0.0003
Weight decay	0.00001
Batch size	16
Maximum epochs	30
Learning-rate schedule	Cosine annealing
Early-stopping patience	7 epochs
Model selection metric	Validation macro F1
Reference checkpoint	models/checkpoints/E007_best_model.pt

The checkpoint SHA-256 recorded for E007 is:

a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c

This hash should be verified against the actual checkpoint before using the model.

7.3 Preprocessing

The baseline transformation includes:

1. Fundus image validation.
2. Retinal-field cropping where applicable.
3. Square-preserving geometric handling.
4. Resizing to 512 × 512.
5. Conversion to the expected tensor representation.
6. ImageNet normalization.

The exact transformation must remain consistent between evaluation and deployment.

Alternative preprocessing methods, including CLAHE, have been investigated experimentally. CLAHE was not retained as the default baseline because the recorded comparison did not establish an improvement.

7.4 Referable DR definition

The current project defines referable DR for its MVP as:

[
\text{Referable DR} = \mathbb{1}[\text{Predicted ICDR Grade} \geq 2]
]

In other words, predicted Grades 2, 3, and 4 are routed toward specialist assessment.

This is a project-level screening rule. It does not establish that the model detects every clinically referable condition.

In particular, the current five-class DR classifier is not a validated diabetic macular edema detector.

⸻

🗂️ 8. Dataset Strategy and Data Integrity

Dataset integrity is essential to reliable model evaluation.

The project has investigated multiple retinal-image datasets, including APTOS and IDRiD.

8.1 APTOS 2019

APTOS 2019 Blindness Detection is the principal development dataset used in the recorded experiments.

The dataset contains 3,662 labelled training images.

Grade	Image count
0	1,805
1	370
2	999
3	193
4	295
Total	3,662

The dataset is class-imbalanced, with substantially fewer images in some severe-grade categories.

Official dataset resource:

APTOS 2019 Blindness Detection — Kaggle

8.2 Duplicate-image audit

The recorded APTOS audit identified:

* 3,662 image files.
* 3,534 unique SHA-256 image hashes.
* 123 exact-duplicate groups.
* 30 groups containing byte-identical images with conflicting labels.

The conflicting groups are quarantined in the current split strategy because the reference labels cannot be reconciled from image identity alone.

The project does not silently majority-vote conflicting labels or treat identical copies as independent observations.

8.3 Current APTOS split

The recorded split contains:

Partition	Images
Training	2,397
Validation	601
Test	602
Conflicting-label quarantine	62
Total	3,662

Exact-image duplicates are grouped to prevent leakage across partitions.

The current split prioritizes duplicate-group integrity over forcing exact percentage ratios.

The split is not simply a conventional stratified random split; its composition reflects duplicate grouping and quarantine requirements.

8.4 IDRiD external evaluation

The recorded external cohort contains 455 images.

Grade	Image count
0	129
1	22
2	156
3	84
4	64
Total	455

The external evaluation uses a frozen E007 checkpoint and the recorded calibration temperature.

The results indicate substantial generalization challenges. These findings are discussed in the validation section below.

Official dataset resource:

Indian Diabetic Retinopathy Image Dataset (IDRiD)

8.5 Data-integrity principles

The project follows these principles:

* Hash-based duplicate detection.
* Explicit treatment of conflicting labels.
* Dataset-specific split manifests.
* No identical image content across the recorded APTOS training, validation, and test partitions.
* No cross-dataset SHA-256 collisions in the recorded APTOS–IDRiD audit.
* Separation of development and external evaluation.
* Explicit documentation of dataset limitations.
* No assumption that labels from different datasets are perfectly interchangeable.

Important: a frozen external dataset must not become a repeatedly tuned development set. If its results influence model development, an additional independent evaluation is required to establish new generalization performance.

⸻

🧪 9. Experimental Research

NetraRakshakAI has progressed through a sequence of controlled experiments.

The following table summarizes the principal recorded experiments. Results should be interpreted in the context of their evaluation cohorts and available artifacts.

Experiment	Research question	Recorded outcome
E001	Establish an EfficientNet-B0 baseline	Baseline classifier trained and evaluated
E002	Does CLAHE improve the baseline?	Not retained
E003	Does weighted cross-entropy help class imbalance?	Retained as a promising historical experiment
E004	Does conservative augmentation improve classification?	Historical result; original checkpoint unavailable in the recorded environment
E005	How do alternative architectures compare?	Historical comparison; some artifacts unavailable
E006	Can ordinal learning improve severity grading?	Rejected because of lower macro F1
E007	Does focal loss improve classification?	Current reference checkpoint
E008	Can Grad-CAM provide useful attribution visualizations?	Attribution pipeline evaluated on a small case set
E009	Does class-balanced focal loss improve performance?	Rejected relative to E007
E010	Does temperature scaling improve probability calibration?	Development calibration performed
E011	How sensitive is E007 to synthetic image perturbations?	Multiple failure modes identified
E012	Does E007 generalize to IDRiD?	External safety gate failed
E013	Can deterministic quality features support image-quality gating?	Preliminary engineering gate implemented
E014	Can current attribution be linked to lesion-level evidence?	Limited evidence; no complete lesion-level validation
E015	Can the screening pipeline be executed end to end?	Inference API and report workflow implemented

Important experimental distinctions

* E001 and E007 are different checkpoints and must not be treated as interchangeable.
* Some historical experiments used different validation cohorts.
* Some historical checkpoints are no longer available in the recorded environment.
* E010’s temperature was fitted on the APTOS validation cohort.
* E012 evaluates external generalization and failed the project’s external sensitivity target.
* E013’s technical quality thresholds are not clinically validated gradability thresholds.
* E014 does not establish validated lesion segmentation.
* E015 is an engineering integration milestone, not a clinical-validation milestone.

Current reference-model validation

The recorded E007 APTOS validation metrics are:

Metric	Value
Accuracy	84.03%
Macro F1	0.7123
Quadratic weighted kappa	0.9156
Referable DR sensitivity	94.44%
Referable DR specificity	94.27%
Macro ROC AUC	0.9475

These results describe the recorded APTOS validation run. They must not be presented as the model’s independently validated clinical performance.

The original E007 validation confusion matrix was:

True \ Predicted	Grade 0	Grade 1	Grade 2	Grade 3	Grade 4
Grade 0	291	4	0	0	0
Grade 1	2	32	20	0	0
Grade 2	5	8	134	14	4
Grade 3	1	0	15	17	2
Grade 4	0	0	13	8	31

The matrix shows that the model frequently confuses adjacent grades and underestimates some severe cases.

These findings motivate the ongoing failure-analysis and generalization program.

⸻

🔥 10. Explainable AI

10.1 Grad-CAM

NetraRakshakAI uses Gradient-weighted Class Activation Mapping (Grad-CAM) to visualize spatial regions contributing to a selected model output.

The current implementation targets the final convolutional feature layer:

model.model.features[-1]

The resulting attribution map is resized and overlaid on the retinal image for visual inspection.

Explainability workflow

flowchart LR
    A["Retinal Image"] --> B["E007 Model"]
    B --> C["Selected Class Score"]
    C --> D["Gradient Computation"]
    D --> E["Feature Map Weighting"]
    E --> F["Grad-CAM Heatmap"]
    F --> G["Overlay Visualization"]
    G --> H["Human Inspection"]
    classDef model fill:#312E81,stroke:#A5B4FC,color:#FFFFFF
    classDef explain fill:#7F1D1D,stroke:#FCA5A5,color:#FFFFFF
    class B,C,D,E model
    class F,G,H explain

10.2 What Grad-CAM can and cannot establish

Grad-CAM can help users inspect where a model’s attribution is concentrated.

It does not prove that:

* The model has detected a specific microaneurysm.
* A highlighted region contains a clinically confirmed lesion.
* The prediction is correct.
* A non-highlighted region is disease-free.
* The model’s attribution is stable across all image perturbations.

The project therefore treats Grad-CAM as a model-attribution tool rather than definitive lesion segmentation.

10.3 Current research limitation

E008 and E014 investigated attribution behaviour on limited case sets.

The recorded evaluation does not establish clinically validated lesion-level localization across the full dataset.

The next research step is to compare appropriate evidence-localization methods against expert-annotated retinal lesions where the annotations are available.

⸻

🖼️ 11. Image Quality Assessment

The current E013 quality gate uses deterministic image features.

Feature	Purpose
FOV coverage	Estimate retinal-field coverage
Laplacian variance	Measure a focus-related image statistic
Edge density	Characterize image edge structure
Mean intensity	Characterize overall brightness
Dark fraction	Measure the fraction of dark pixels
Bright fraction	Measure the fraction of bright pixels
Percentile intensity spread	Estimate image contrast-related variation
Noise MAD proxy	Estimate a noise-related image statistic

These features feed an engineering threshold-based decision.

Recorded E013 observations

Observation	Recorded result
APTOS validation images evaluated	601
Images passing the quality gate	537
Images failing the quality gate	64
Clean-validation rejection rate	10.65%

The 10.65% figure is a clean-validation rejection rate, not a clinically measured false-rejection rate.

Clinical gradability labels are required to estimate false rejection and false acceptance against a suitable reference standard.

Current limitations

* The thresholds are not clinically validated.
* Technical image quality is not equivalent to clinical gradability.
* Some synthetic perturbations produced non-monotonic detection behaviour.
* The quality gate can change the population reaching the classifier.
* Performance must be investigated across disease grades and image-acquisition conditions.

Research direction

The next quality-assessment milestone is to compare E013 against qualified human image-gradability assessments.

The goal is to determine whether the quality gate can identify technically inadequate images without disproportionately rejecting images containing important disease.

⸻

📊 12. Confidence Calibration and Uncertainty

A neural network’s maximum predicted probability is not automatically a reliable measure of the probability that its prediction is correct.

NetraRakshakAI investigates temperature scaling as a calibration method.

Temperature scaling

Let the model produce logits:

[
z = [z_0,z_1,z_2,z_3,z_4]
]

Temperature scaling adjusts them using a positive scalar (T):

[
p_i = \frac{\exp(z_i/T)}
{\sum_{j=0}^{4}\exp(z_j/T)}
]

The current recorded temperature is:

[
T = 0.7785
]

This value was fitted on the APTOS validation cohort.

Temperature scaling changes the probability distribution while preserving the ordering of logits for a single prediction. Therefore, it does not change the predicted class when the same logits are used.

Recorded development-calibration results

Metric	Before calibration	After calibration
Multiclass ECE	0.0797	0.0377
Multiclass Brier score	0.2503	0.2404
Multiclass negative log-likelihood	0.4736	0.4533
Referable ECE	0.0438	0.0359
Referable Brier score	0.0528	0.0510
Referable negative log-likelihood	0.1781	0.1691

These are recorded development-cohort measurements, not proof of calibration on an independent population.

Why external calibration matters

The recorded IDRiD evaluation showed a substantial referable sensitivity decline. A calibration method fitted on APTOS cannot be assumed to transfer reliably to a different dataset.

External calibration assessment must therefore be conducted without repeatedly adjusting the system against the same external evaluation results.

⸻

🚨 13. External Validation and Safety

External validation is one of the most important parts of the project.

The current evidence shows a meaningful gap between development performance and external performance.

APTOS versus IDRiD

Metric	APTOS validation	IDRiD external evaluation
Evaluation images	601	455
Macro F1	0.7123	0.4266
Quadratic weighted kappa	0.9156	0.7187
Referable sensitivity	94.44%	79.61%
Referable specificity	94.27%	98.68%
External sensitivity target	>90%	Not met
External safety gate	Development evaluation	FAILED

The recorded IDRiD evaluation identified 62 referable false negatives.

The error analysis showed that missed referable cases were concentrated in downward severity predictions.

Interpretation

The external evaluation indicates that E007 does not yet meet the project’s target for referable DR sensitivity across the tested external cohort.

Potential contributing factors include:

* Dataset and acquisition-domain differences.
* Severity-discrimination limitations.
* Image-quality variation.
* Preprocessing interactions.
* Differences in reference-label characteristics.

These are hypotheses to investigate. The current results do not establish that any single factor explains the performance decline.

Safety commitment

NetraRakshakAI will not present the APTOS validation metrics as evidence that the model has passed external clinical validation.

The external safety gate remains failed until an appropriately evaluated candidate satisfies the predefined criteria on suitable independent data.

⸻

💻 14. Frontend and User Experience

The React frontend provides a PHC-oriented screening interface connected to the Python inference backend.

The user experience is organized around a staged workflow:

1. Patient information.
2. Image selection.
3. Quality assessment.
4. AI analysis.
5. Screening result.
6. Explainability.
7. Human review and reporting.

Frontend capabilities

The current frontend includes:

* Image-upload interaction.
* Screening workflow stages.
* Live backend communication.
* Display of image-quality measurements.
* Five-class grading output.
* Probability and referable-risk display.
* Grad-CAM visualization.
* Structured recommendation presentation.
* Screening report interaction.
* Health-status feedback.
* Demonstration fixtures for illustrative scenarios.

Live mode and demonstration mode

The frontend distinguishes real backend inference from demonstration fixtures.

A demonstration case must not be represented as a live model prediction.

Live screening requests must use the configured inference service. If the backend fails, the application should expose the error rather than silently substituting a simulated result.

Frontend repository

The frontend is maintained separately:

NetraRakshakAI Frontend Repository

The frontend is built with React, TypeScript, Vite, Tailwind CSS, and supporting UI libraries.

⸻

⚙️ 15. Backend and API

The Python backend uses FastAPI to expose the screening pipeline over HTTP.

E015 inference pipeline

The current inference flow is:

1. Validate and decode the submitted image.
2. Evaluate the image using the E013 quality gate.
3. Stop automated classification if the gate fails.
4. Apply the canonical E001 baseline transformation.
5. Run the frozen E007 checkpoint.
6. Apply temperature scaling.
7. Generate Grad-CAM when enabled and available.
8. Apply the current triage rules.
9. Return structured JSON.
10. Generate report and visualization artifacts where applicable.

Important implementation details

* The checkpoint SHA-256 is verified against the expected E007 hash.
* The model uses five-class classification.
* The calibration temperature is 0.7785.
* The inference transform uses 512 × 512 model inputs.
* Grad-CAM is generated from the configured convolutional feature layer.
* Quality-gate failures do not proceed to classification.
* Backend responses include model and pipeline metadata.
* The API has a health endpoint and a screening endpoint.

The inference pipeline is implemented in the backend repository. The frontend consumes the API response rather than duplicating the model logic.

⸻

📄 16. Screening Reports

The report workflow packages screening output into a structured format.

A report may include:

* Screening identifier.
* Screening timestamp.
* Image-quality status.
* Relevant quality measurements.
* Predicted ICDR grade.
* Five-class probability distribution.
* Referable prediction.
* Referable probability.
* Temperature-scaling metadata.
* Grad-CAM availability and visualization.
* Triage recommendation.
* Model version.
* Checkpoint hash.
* Pipeline version.
* Scientific limitations and safety disclaimer.

Example report structure

NETRARAKSHAKAI
Diabetic Retinopathy Screening Report
Screening ID: <screening_id>
Date and Time: <timestamp>
IMAGE QUALITY
Status: PASS / FAIL
AI-ASSISTED SCREENING RESULT
Predicted ICDR Grade: <grade>
Predicted Severity: <grade_name>
MODEL PROBABILITIES
Grade 0: <probability>
Grade 1: <probability>
Grade 2: <probability>
Grade 3: <probability>
Grade 4: <probability>
REFERABLE DR TRIAGE
Referable Prediction: TRUE / FALSE
Referable Probability: <probability>
EXPLAINABILITY
Grad-CAM: Available / Unavailable
MODEL PROVENANCE
Checkpoint SHA-256: <hash>
Model Version: <version>
Pipeline Version: <version>
DISCLAIMER
AI-assisted screening output requires qualified clinical interpretation.

The values above are placeholders illustrating the report format, not an actual patient report.

The report is a screening aid. It is not a definitive diagnosis, and it must not replace qualified clinical interpretation.

⸻

🛠️ 17. Technology Stack

Machine learning and computer vision

Technology	Role
Python	Core programming language
PyTorch	Deep-learning model implementation
Torchvision	Model architectures and pretrained weights
NumPy	Numerical operations
Pandas	Dataset manifests and tabular analysis
OpenCV	Image-processing operations
Pillow	Image loading and conversion
Scikit-learn	Evaluation metrics and supporting utilities
Matplotlib	Visualization and diagnostic plots

Backend

Technology	Role
FastAPI	REST API
Uvicorn	ASGI server
Pydantic	Request and response validation
ReportLab	PDF report generation
Pytest	Automated testing

Frontend

Technology	Role
React	User interface
TypeScript	Typed application logic
Vite	Development server and build system
Tailwind CSS	Styling
Lucide React	Icons
Motion	Interface animations

Research and deployment tools

* Conda.
* Git and GitHub.
* Kaggle dataset resources.
* macOS and Apple Silicon MPS for local development.
* Railway for hosted prototype deployment.
* MATLAB/Simulink for the planned operational workflow simulation.

The availability of a technology in the stack does not imply that every planned research component has been completed.

⸻

📁 18. Repository Structure

The following is a conceptual map of the project. Some directories contain implemented modules, while others are reserved for experiments or planned work. Verify the current checkout before assuming every example file exists.

dr-screening/
│
├── README.md
├── LICENSE
├── .gitignore
├── AGENTS.md
├── requirements.txt
├── environment.yml
│
├── app/
│   ├── Main application
│   ├── UI components
│   └── Screening workflow
│
├── configs/
│   ├── base.yaml
│   ├── aptos.yaml
│   ├── idrid.yaml
│   └── experiments/
│       ├── baseline.yaml
│       ├── preprocessing.yaml
│       ├── class_balance.yaml
│       ├── augmentation.yaml
│       ├── architecture.yaml
│       ├── ordinal.yaml
│       ├── calibration.yaml
│       └── robustness.yaml
│
├── data/
│   ├── raw/
│   │   ├── aptos/
│   │   ├── eyepacs/
│   │   ├── idrid/
│   │   └── messidor2/
│   │
│   ├── processed/
│   │   ├── train/
│   │   ├── validation/
│   │   ├── test/
│   │   └── aptos/
│   │
│   └── external/
│       └── messidor2/
│
├── notebooks/
│   ├── 01_dataset_audit.ipynb
│   ├── 02_data_exploration.ipynb
│   ├── 03_preprocessing_analysis.ipynb
│   ├── 04_baseline_training.ipynb
│   ├── 05_model_evaluation.ipynb
│   ├── 06_explainability.ipynb
│   ├── 07_calibration.ipynb
│   ├── 08_robustness.ipynb
│   └── 09_external_validation.ipynb
│
├── src/
│   ├── api/
│   ├── data/
│   ├── preprocessing/
│   ├── models/
│   ├── training/
│   ├── evaluation/
│   ├── explainability/
│   ├── robustness/
│   └── inference/
│
├── scripts/
│   ├── Training and evaluation scripts
│   └── Experiment utilities
│
├── models/
│   └── checkpoints/
│       └── E007_best_model.pt
│
├── experiments/
│   ├── experiment_registry.csv
│   ├── E001/
│   ├── E007/
│   └── ...
│
├── results/
│   ├── evaluation/
│   ├── calibration/
│   ├── robustness/
│   ├── external_validation/
│   └── failure_analysis/
│
├── docs/
│   ├── api_specification.md
│   ├── inference_pipeline.md
│   └── research/
│
├── matlab/
├── simulink/
│
└── tests/
    ├── Unit tests
    ├── Integration tests
    └── Inference tests

Data-storage rule

Dataset images, generated reports, and model checkpoints may be large or subject to licensing and privacy constraints.

Do not commit restricted datasets, patient information, private credentials, or generated screening artifacts to the repository.

Follow each dataset’s license and access conditions.

⸻

🚀 19. Installation and Setup

These instructions describe the intended local development workflow. Exact dependencies and available scripts should be checked against the current repository checkout.

19.1 Prerequisites

* macOS, Linux, or a compatible Windows environment.
* Python 3.12.
* Conda or a compatible environment manager.
* Git.
* Sufficient storage for the datasets you intend to use.
* A compatible PyTorch execution device.

For Apple Silicon development, PyTorch may use the Metal Performance Shaders (MPS) backend when supported.

CUDA is relevant to compatible NVIDIA hardware.

19.2 Clone the repository

git clone <YOUR_BACKEND_REPOSITORY_URL>
cd dr-screening

Replace the placeholder with the actual backend repository URL.

19.3 Create the environment

If the project environment file is available:

conda env create -f environment.yml
conda activate dr-screening

Alternatively, create a Python 3.12 environment:

conda create -n dr-screening python=3.12
conda activate dr-screening

19.4 Install dependencies

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

19.5 Verify the environment

python --version
python -c "import torch; print('PyTorch:', torch.__version__)"
python -c "import torchvision; print('Torchvision:', torchvision.__version__)"
python -c "import fastapi; print('FastAPI:', fastapi.__version__)"

Check MPS availability on supported Apple Silicon systems:

python -c "import torch; print('MPS available:', torch.backends.mps.is_available())"

Check CUDA availability on compatible systems:

python -c "import torch; print('CUDA available:', torch.cuda.is_available())"

The execution device depends on the installed build, hardware, and runtime configuration.

⸻

▶️ 20. Running the Application

20.1 Prepare the model checkpoint

Ensure the expected checkpoint exists:

models/checkpoints/E007_best_model.pt

Verify its SHA-256:

shasum -a 256 models/checkpoints/E007_best_model.pt

Expected recorded hash:

a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c

Do not use a different checkpoint without documenting the change and updating the appropriate model configuration and provenance.

20.2 Start the backend

If the current FastAPI application entry point is src.api.app:app, run:

uvicorn src.api.app:app --host 127.0.0.1 --port 8000

If the entry point has changed in your current checkout, use the actual module path defined by that version.

20.3 Check backend health

curl -i http://127.0.0.1:8000/api/v1/health

The health response should indicate whether the inference service is available and whether the expected checkpoint has been verified.

20.4 Configure the frontend

In the separate frontend repository, configure the local backend URL:

VITE_SCREENING_API_URL=http://127.0.0.1:8000

Save this in .env.local.

Do not commit .env.local or real secrets.

20.5 Start the frontend

From the frontend repository:

npm install
npm run dev

The development server is configured to use port 3000 in the current recorded frontend setup.

Open the local URL shown by Vite in your browser.

20.6 Production build checks

In the frontend repository:

npm run lint
npm run build

These commands verify TypeScript/build correctness. They do not, by themselves, verify end-to-end clinical behaviour.

⸻

🌐 21. API Reference

The current backend exposes the following principal endpoints.

Method	Endpoint	Purpose
GET	/api/v1/health	Check service and checkpoint status
POST	/api/v1/screen	Submit a fundus image for screening
GET	/api/v1/artifacts/{filename}	Retrieve an available screening artifact

The exact response schema is defined by the current backend implementation.

21.1 Health check

curl -i http://127.0.0.1:8000/api/v1/health

The response provides service-status information, including checkpoint verification when available.

21.2 Submit a screening image

curl -X POST \
  http://127.0.0.1:8000/api/v1/screen \
  -F "file=@/path/to/fundus_image.png"

Replace the example path with an image you are permitted to use.

21.3 Response structure

A successful response may contain fields similar to the following:

{
  "status": "SUCCESS",
  "quality": {
    "status": "PASS",
    "metrics": {},
    "failed_checks": [],
    "message": "Image quality acceptable for AI screening triage."
  },
  "classification": {
    "predicted_grade": 2,
    "predicted_grade_name": "Moderate NPDR",
    "class_probabilities": [
      0.0009,
      0.1191,
      0.4528,
      0.2834,
      0.1439
    ],
    "referable": true,
    "referable_probability": 0.88,
    "confidence": 0.4528
  },
  "calibration": {
    "temperature": 0.7785,
    "calibrated": true,
    "method": "Frozen development calibration from APTOS validation."
  },
  "explanation": {
    "gradcam_available": true,
    "target_layer": "model.model.features[-1]",
    "status": "generated"
  },
  "recommendation": {
    "action": "SPECIALIST_REFERRAL",
    "reason": "Referable diabetic retinopathy detected (ICDR Grade 2 >= 2)."
  },
  "metadata": {
    "model_version": "E007",
    "pipeline_version": "1.0.0-E015"
  }
}

This is an illustrative example based on the recorded response structure, not a guaranteed literal response for every request. Actual values, optional fields, timing, and error handling depend on the image and current implementation.

The example is also not a diagnosis for a real patient.

21.4 Quality-gate failure

If an image fails the quality gate, classification may be absent and the recommendation may direct the case toward recapture or human review.

The frontend should not fabricate a classification for an image the backend has rejected.

⸻

📈 22. Evaluation Metrics

NetraRakshakAI evaluates multiple aspects of model behaviour.

Classification metrics

Accuracy

The proportion of predictions matching the reference labels.

[
Accuracy = \frac{TP+TN}{TP+TN+FP+FN}
]

For multiclass classification, the corresponding overall accuracy is calculated across all classes.

Precision

The proportion of predicted positive cases that are true positives.

[
Precision = \frac{TP}{TP+FP}
]

Recall / Sensitivity

The proportion of actual positive cases correctly identified.

[
Sensitivity = \frac{TP}{TP+FN}
]

Specificity

The proportion of actual negative cases correctly identified.

[
Specificity = \frac{TN}{TN+FP}
]

Macro F1

The unweighted average of per-class F1 scores.

Macro F1 is important because it prevents the largest class from dominating the summary metric.

Quadratic Weighted Kappa

Quadratic weighted kappa measures agreement while penalizing disagreements according to their distance on the ordered severity scale.

It is useful for investigating the severity structure of classification errors.

Calibration metrics

* Expected Calibration Error (ECE).
* Maximum Calibration Error (MCE).
* Brier score.
* Negative log-likelihood.
* Reliability diagrams.

Explainability and segmentation metrics

Where appropriate annotations are available:

* Dice coefficient.
* Intersection over Union.
* Lesion-level sensitivity.
* Precision-recall analysis.
* False positives per image.
* Localization analysis.

These metrics must only be reported for tasks and cohorts for which suitable reference annotations exist.

Robustness metrics

* Change in referable sensitivity.
* Change in specificity.
* Change in macro F1.
* Change in quadratic weighted kappa.
* Prediction consistency under controlled perturbations.
* Frequency of invalid or failed outputs.

Operational metrics

* End-to-end inference latency.
* Model-forward latency.
* Grad-CAM generation time.
* Memory usage.
* Report-generation latency.
* Queue and processing capacity under simulated workloads.

No single metric establishes clinical readiness.

⸻

🔁 23. Reproducibility and Experiment Tracking

A research result is only useful if its origin can be established.

Each experiment should record:

* Experiment ID.
* Hypothesis.
* Dataset version.
* Split-manifest version.
* Checkpoint hash.
* Architecture.
* Input resolution.
* Preprocessing configuration.
* Loss function.
* Optimizer.
* Learning-rate schedule.
* Random seed.
* Hardware and software environment.
* Training duration.
* Model-selection criterion.
* Validation metrics.
* Evaluation cohort.
* Known limitations.
* Final decision.

Recommended experiment lifecycle

flowchart TD
    A["Research Question"] --> B["Pre-Registered Hypothesis"]
    B --> C["Dataset and Split Verification"]
    C --> D["Controlled Experiment"]
    D --> E["Validation Evaluation"]
    E --> F["Error and Safety Analysis"]
    F --> G{"Acceptance Criteria Met?"}
    G -->|Yes| H["Freeze Candidate"]
    G -->|No| I["Document Failure"]
    H --> J["Independent Evaluation"]
    I --> K["Update Research Plan"]
    J --> L{"External Criteria Met?"}
    L -->|Yes| M["Retain Evidence and Candidate"]
    L -->|No| K
    classDef process fill:#1E3A8A,stroke:#60A5FA,color:#FFFFFF
    classDef decision fill:#78350F,stroke:#FBBF24,color:#FFFFFF
    classDef success fill:#064E3B,stroke:#34D399,color:#FFFFFF
    class A,B,C,D,E,F process
    class G,L decision
    class H,M success

Experiment-tracking rule

Change one major variable at a time whenever practical.

Do not select a model solely because it improves one metric. Investigate the effects on:

* Referable sensitivity.
* Specificity.
* Per-class recall.
* Calibration.
* External performance.
* Compute requirements.

The current E007 checkpoint should remain preserved as the reference baseline while new candidates are investigated.

⸻

🔐 24. Security and Data Privacy

Healthcare-related software requires careful treatment of image data, screening records, and generated artifacts.

The current prototype should not be assumed to satisfy every production healthcare security or compliance requirement.

Security principles

Data minimization

Collect only the information needed for the intended workflow.

Controlled access

Restrict access to images, reports, and screening records according to user responsibilities.

Secret management

Do not commit API keys, passwords, access tokens, or deployment credentials.

Auditability

Record model provenance and important workflow events where appropriate.

Artifact lifecycle

Generated reports and Grad-CAM images should have a defined storage and deletion policy.

Safe error handling

A failed request must return an explicit error or review state rather than a fabricated prediction.

Deployment configuration

Development and production endpoints must be configured deliberately. A production deployment should not silently fall back to a demonstration response.

Dataset licensing

Respect the terms governing the use, redistribution, and modification of each dataset.

Future interoperability

Potential future work includes investigating:

* Appropriate Indian digital-health interoperability standards.
* Consent and access-control requirements.
* Secure clinical-system integration.
* Auditable referral records.
* Defined data-retention policies.

No ABDM integration or regulatory compliance should be claimed unless the corresponding requirements have actually been implemented and verified.

⸻

⚠️ 25. Limitations and Known Risks

Transparency is part of the engineering design.

Limitation	Current status	Required next step
External generalization	IDRiD referable sensitivity is 79.61%; safety gate failed	Investigate failures and evaluate improved candidates independently
Severe-grade confusion	Downward Grade 3/4 errors observed	Conduct image-level error analysis
Image gradability	Current gate uses engineering thresholds	Compare against qualified human gradability assessments
Calibration transfer	Temperature fitted on APTOS validation	Assess on independent data
Grad-CAM validity	Attribution visualization available	Validate separately; do not treat as lesion proof
Lesion segmentation	Not established as a validated integrated capability	Use appropriate expert annotations and segmentation metrics
DME detection	Not established by the current five-class classifier	Investigate separately with suitable labels
Uncertainty policy	Current threshold is experimental	Validate uncertainty-based routing
Robustness	Synthetic stress tests show important failure modes	Investigate realistic acquisition failures
Real-world performance	No prospective clinical performance claim established	Conduct appropriate clinical evaluation
Throughput	Local and remote timing observations are environment-specific	Benchmark target hardware and realistic workloads
Clinical workflow	Prototype workflow implemented	Obtain appropriate clinical review and workflow evidence

What the system must not claim

The current prototype must not claim that it:

* Diagnoses diabetic retinopathy definitively.
* Excludes disease when a non-referable result is produced.
* Reliably detects DME.
* Provides validated lesion segmentation through Grad-CAM.
* Has achieved the project’s external validation targets.
* Is clinically validated for autonomous screening.
* Is approved for clinical use merely because the software runs successfully.

The project is intended to support research into AI-assisted screening and triage.

⸻

🛣️ 26. Research Roadmap

The next development phase focuses on evidence, generalization, and workflow reliability.

N1 — Failure Atlas and Generalization Audit

Priority: Immediate

* Verify the current E007 checkpoint.
* Reproduce the reference validation results.
* Generate per-class error analysis.
* Investigate referable false negatives.
* Compare APTOS and IDRiD failure patterns.
* Check preprocessing consistency.
* Create a machine-readable failure manifest.

N2 — Controlled Model Improvement

* Investigate higher-resolution inputs.
* Revisit ordinal and hybrid objectives.
* Evaluate preprocessing alternatives.
* Investigate severe-grade discrimination.
* Preserve a reproducible baseline.

N3 — Independent External Validation

* Establish a frozen evaluation protocol.
* Expand external evaluation where suitable data are available.
* Report confidence intervals.
* Evaluate calibration independently.
* Document every safety-gate failure.

N4 — Clinically Grounded Quality Assessment

* Establish a human-gradability labeling protocol.
* Evaluate E013 against qualified reviewers.
* Investigate false rejection and false acceptance.
* Analyze quality-gate behaviour by disease grade.

N5 — Quantitative Lesion Evidence

* Verify access to suitable expert annotations.
* Train lesion-specific baselines where appropriate.
* Evaluate localization and segmentation quantitatively.
* Investigate whether lesion evidence improves grading or review.

N6 — Human Review and Referral Workflow

* Formalize case states.
* Improve uncertainty routing.
* Record reviewer decisions appropriately.
* Evaluate review workload and workflow behaviour.

N7 — DME Research

* Audit available labels.
* Establish a separate research protocol.
* Evaluate a separate DME model if justified.
* Investigate appropriate referral integration.

N8 — Simulink Capacity Simulation

* Model patient arrivals.
* Model image acquisition and quality failures.
* Model inference and human-review queues.
* Evaluate district-scale scenarios.
* Report explicit assumptions and capacity estimates.

N9 — Edge and Offline Operation

* Benchmark target hardware.
* Improve local inference reliability.
* Define queueing and recovery behaviour.
* Evaluate operation under reduced connectivity.

N10 — Security and Auditability

* Improve access control.
* Define retention and deletion policies.
* Strengthen model provenance.
* Document production security requirements.

N11 — National Demonstration and Evidence Package

* Prepare reproducible evaluation reports.
* Demonstrate quality rejection and recapture.
* Show five-class output and attribution.
* Present external limitations honestly.
* Demonstrate the complete workflow.
* Separate measured results from future objectives.

⸻

🤝 27. Contributing

Contributions should improve the system in a measurable and reproducible way.

Suggested contribution workflow

1. Identify a research or engineering problem.
2. Document a hypothesis or requirement.
3. Verify the existing behaviour.
4. Create a controlled implementation or experiment.
5. Add appropriate automated tests.
6. Record the relevant configuration.
7. Evaluate against a suitable baseline.
8. Document limitations and results.
9. Review the changes before merging.

Coding principles

* Prefer modular components.
* Keep model inference separate from UI logic.
* Avoid hard-coded environment-specific paths.
* Preserve model and data provenance.
* Keep test and evaluation code reproducible.
* Avoid silently changing established experimental protocols.
* Do not introduce unsupported clinical claims.
* Keep generated data and restricted datasets out of Git.

Reporting experiments

An experiment report should include the question, method, dataset, checkpoint, metrics, failure analysis, and conclusion.

A failed experiment is still useful when it provides reliable evidence.

⸻

📚 28. References and Resources

The following resources provide the scientific and technical foundation for this project.

Datasets

APTOS 2019 Blindness Detection

Kaggle competition and dataset resources

Indian Diabetic Retinopathy Image Dataset (IDRiD)

Official IDRiD dataset resource

Model architecture

EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks

Tan, M. and Le, Q. V. (2019).

arXiv:1905.11946

Explainable AI

Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization

Selvaraju, R. R. et al. (2017).

arXiv:1610.02391

Probability calibration

On Calibration of Modern Neural Networks

Guo, C. et al. (2017).

arXiv:1706.04599

Clinical grading framework

Proposed International Clinical Diabetic Retinopathy and Diabetic Macular Edema Disease Severity Scales

Wilkinson, C. P. et al. (2003).

Ophthalmology — DOI: 10.1016/S0161-6420(03)00475-5

Deep-learning-based DR detection

Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs

Gulshan, V. et al. (2016).

JAMA — DOI: 10.1001/jama.2016.17216

Technical documentation

* PyTorch
* Torchvision
* FastAPI
* React
* Vite
* Mermaid diagrams
* MATLAB
* Simulink

These references support the project’s research and implementation. They do not independently validate the current NetraRakshakAI implementation.

⸻

👥 29. Team and Acknowledgements

<div align="center">

NetraRakshakAI

Explainable AI for Diabetic Retinopathy Screening in Rural India

Developed as a research-oriented healthcare technology project for the Smart India Hackathon problem statement SIH26038.

</div>

The project brings together work in:

* Computer vision.
* Deep learning.
* Medical-image preprocessing.
* Explainable AI.
* Model evaluation.
* API engineering.
* Frontend development.
* Healthcare workflow design.
* Research reproducibility.

The project builds on publicly available research, open-source software, and retinal-image datasets subject to their respective licenses and terms.

Team name: TeamGG

Add the verified names and roles of the participating team members and mentors before publishing the final project README.

⸻

⚕️ 30. Disclaimer

NetraRakshakAI is a research prototype intended to investigate AI-assisted diabetic retinopathy screening.

It is not a substitute for a comprehensive eye examination, a qualified ophthalmologist, or an appropriately validated clinical screening pathway.

The current model has demonstrated an external generalization limitation: the recorded IDRiD evaluation achieved 79.61% referable DR sensitivity, below the project’s target of greater than 90%. The external safety gate therefore remains failed.

Grad-CAM visualizations show model attribution and do not establish definitive lesion detection. The current image-quality gate uses engineering thresholds that have not been clinically validated against a suitable human-gradability reference standard.

A non-referable model prediction does not guarantee the absence of diabetic retinopathy or other eye disease. Clinical interpretation and follow-up must be determined by qualified healthcare professionals under appropriate local protocols.

Do not use this prototype as the sole basis for diagnosis, treatment, or decisions that could affect patient care.

⸻

<div align="center">

NetraRakshakAI

Quality before prediction. Evidence before confidence. Human oversight before clinical decisions.

Building a more transparent and rigorously evaluated approach to AI-assisted retinal screening.

</div>
