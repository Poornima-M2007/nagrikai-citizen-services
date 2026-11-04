ALTER TABLE public.schemes
  ADD COLUMN verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN eligibility_rules jsonb,
  ADD COLUMN data_quality_notes text;

ALTER TABLE public.schemes
  ADD CONSTRAINT schemes_verification_status_check
  CHECK (verification_status IN ('verified', 'partially_verified', 'unverified'));

COMMENT ON COLUMN public.schemes.verification_status IS 'Audit classification: verified | partially_verified | unverified, based on official-source support.';
COMMENT ON COLUMN public.schemes.eligibility_rules IS 'Structured eligibility criteria for future rule-based matching (income limits, age, education, occupation, residence, category). NULL means not yet structured; only source-verified facts may be stored here.';
COMMENT ON COLUMN public.schemes.data_quality_notes IS 'Records which fields are missing or unverified so they are never presented as confirmed facts.';

-- Backfill audit results (part of this additive schema change).

UPDATE public.schemes SET verification_status = 'verified',
  eligibility_rules = '{"occupation": "landholding farmer family", "landholding_required": true, "exclusions": "income-tax payers and specified public-office/employee/professional categories excluded per official FAQ"}'::jsonb,
  data_quality_notes = 'Eligibility, exclusions, documents and application process verified against the official PM-KISAN FAQ. No fixed income limit applies; exclusion-based.'
WHERE id = 'pmkisan';

UPDATE public.schemes SET verification_status = 'verified',
  eligibility_rules = '{"income_limits_annual_inr": {"EWS": 300000, "LIG": 600000, "MIG": 900000}, "residence": "urban", "no_pucca_house_anywhere_in_india": true, "prior_housing_benefit_within_20_years_excluded": true}'::jsonb,
  data_quality_notes = 'Income limits, ownership and prior-benefit conditions verified against the PMAY-U 2.0 operational guidelines. Required documents are component-specific and only partly verified.'
WHERE id = 'pmay';

UPDATE public.schemes SET verification_status = 'verified',
  eligibility_rules = '{"gender": ["women", "gender minorities"], "residence_state": "Karnataka", "age_min": 6, "photo_identity_required": true}'::jsonb,
  data_quality_notes = 'Eligibility, identity-document requirement and service exclusions verified against the official district NIC page. No online application URL exists; benefit is used during travel.'
WHERE id = 'karnataka-shakti';

UPDATE public.schemes SET verification_status = 'partially_verified',
  eligibility_rules = '{"senior_route_age_min": 70, "general_route_basis": "official beneficiary identification criteria"}'::jsonb,
  data_quality_notes = 'Core cover and the age-70 senior-citizen extension verified via PIB. Required-documents list unavailable; general-route eligibility depends on beneficiary identification, not detailed public criteria.'
WHERE id = 'pmjay';

UPDATE public.schemes SET verification_status = 'partially_verified',
  eligibility_rules = '{"age_min": 18, "occupation": "traditional artisan or craftsperson in one of 18 covered trades (self-employed, unorganised sector)", "one_member_per_family": true, "government_service_excluded": true, "prior_credit_scheme_restrictions": true}'::jsonb,
  data_quality_notes = 'Eligibility and benefits verified via PIB. Required-documents list unavailable; whether fresh registration is currently open was not verified.'
WHERE id = 'pmvishwakarma';

UPDATE public.schemes SET verification_status = 'partially_verified',
  eligibility_rules = '{"income_limit_annual_inr": 250000, "category": ["OBC", "EBC", "DNT"], "education": "student (component-specific class/course rules apply)"}'::jsonb,
  data_quality_notes = 'Umbrella programme; income limit and category verified via PIB explainer. Component-specific institution, class, selection rules and document lists differ and were not individually verified.'
WHERE id = 'pmyasasvi';

UPDATE public.schemes SET verification_status = 'partially_verified',
  eligibility_rules = '{"ration_card": ["BPL/PHH", "AAY"], "residence_state": "Karnataka"}'::jsonb,
  data_quality_notes = 'Ration-card eligibility verified via official district Food Department page. Current allocation/top-up entitlement and document list unverified; no verified online application URL.'
WHERE id = 'karnataka-anna-bhagya';

UPDATE public.schemes SET verification_status = 'partially_verified',
  eligibility_rules = '{"education": ["graduate", "diploma holder"], "employment_status": "unemployed", "residence_state": "Karnataka"}'::jsonb,
  data_quality_notes = 'Benefit amounts and broad eligibility verified via official district Skill Development page. Current graduating-cohort conditions, document list and intake availability unverified.'
WHERE id = 'karnataka-yuva-nidhi';

UPDATE public.schemes SET verification_status = 'partially_verified',
  eligibility_rules = NULL,
  data_quality_notes = 'Name, benefit amount (Rs 2,000/month) and women-head-of-household targeting verified via official district welfare directory. Detailed eligibility and exclusion rules, document list and application URL unverified; structured eligibility intentionally left empty.'
WHERE id = 'karnataka-gruha-lakshmi';

UPDATE public.schemes SET verification_status = 'partially_verified',
  eligibility_rules = '{"category": ["Backward Classes"], "education": "post-matric student", "not_in_government_or_aided_hostel": true, "residence_state": "Karnataka"}'::jsonb,
  data_quality_notes = 'Student group, post-matric requirement and hostel exclusion verified via official district welfare directory. Current benefit amount, document list and application window unverified.'
WHERE id = 'karnataka-vidyasiri';