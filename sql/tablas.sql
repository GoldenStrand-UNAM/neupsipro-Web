DROP DATABASE neupsipro;
CREATE DATABASE neupsipro;
USE neupsipro;

CREATE TABLE roles (
    id_role  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    label    VARCHAR(10)  NOT NULL
);

CREATE TABLE privilege (
    id_privilege     INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    permited_action  VARCHAR(20)  NOT NULL,
    permissions      VARCHAR(50)  NULL
);

CREATE TABLE privilege_role (
    id_privilege_role  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_privilege       INT NOT NULL,
    id_role            INT NULL,
    CONSTRAINT fk_rp_privilege FOREIGN KEY (id_privilege) REFERENCES privilege (id_privilege),
    CONSTRAINT fk_rp_role      FOREIGN KEY (id_role)      REFERENCES roles (id_role)
);

CREATE TABLE acl (
    id_acl         INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    consultation   BOOL         NOT NULL,
    writting       BOOL         NOT NULL,
    edit           BOOL         NOT NULL,
    eliminate      BOOL         NOT NULL
);

CREATE TABLE log_record (
    id_record        VARCHAR(36)  NOT NULL PRIMARY KEY,
    id_user          VARCHAR(36)  NOT NULL,   -- FK agregada después de crear usuario
    time_and_date    DATETIME     NULL,
    recorded_action  VARCHAR(20)  NOT NULL,
    affected_table   VARCHAR(20)  NOT NULL
);

CREATE TABLE access_role (
    id_access_role  INT  NOT NULL AUTO_INCREMENT,
    id_acl          INT  NOT NULL,
    id_user         VARCHAR(36)  NOT NULL,
    PRIMARY KEY (id_access_role)
);


CREATE TABLE modules (
    id_module  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    module     VARCHAR(30)  NOT NULL
);

CREATE TABLE acl_modules (
    id_acl_module  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_acl         INT         NOT NULL,
    id_module      INT         NOT NULL,
    CONSTRAINT fk_am_acl    FOREIGN KEY (id_acl)    REFERENCES acl (id_acl),
    CONSTRAINT fk_am_module FOREIGN KEY (id_module) REFERENCES modules (id_module)
);

CREATE TABLE tutorial (
    id_tutorial  VARCHAR(36)  NOT NULL PRIMARY KEY,
    id_module    INT          NOT NULL,
    title        VARCHAR(50)  NOT NULL,
    content      VARCHAR(150) NOT NULL,
    CONSTRAINT fk_tutorial_module FOREIGN KEY (id_module) REFERENCES modules (id_module)
);

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
	id_user            VARCHAR(36)  NOT NULL PRIMARY KEY,
    id_role            INT          NOT NULL,
    user_name          VARCHAR(20)  NOT NULL,
    first_name	       VARCHAR(20)  NOT NULL,
    lastname_p         VARCHAR(20)  NOT NULL,
    lastname_m         VARCHAR(20)  NULL,
    email              VARCHAR(50)  NULL,
    profile_photo      VARCHAR(255) NULL,
    birthdate          DATE         NULL,
    eliminated         BOOL         NOT NULL DEFAULT 0,
    password_hash      VARCHAR(250) NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (id_role) REFERENCES roles (id_role)
);

CREATE TABLE sessions (
	id_session       VARCHAR(36)  NOT NULL PRIMARY KEY,
    id_user          VARCHAR(36)  NOT NULL,
    ip_address       VARCHAR(45)  NOT NULL,
    user_agent       TEXT,
    expires_at       TIMESTAMP    NOT NULL,
    is_revoked       BOOLEAN      DEFAULT FALSE,
    created_at       TIMESTAMP    DEFAULT current_timestamp,
    last_activity_at TIMESTAMP    DEFAULT current_timestamp,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE user_relation (
    id_user_relation  VARCHAR(36)  NOT NULL PRIMARY KEY,
    id_user           VARCHAR(36)  NOT NULL,
    id_clinic_user    VARCHAR(36)  NULL,
    assignment_date   DATE         NULL,
    type ENUM('assigned', 'initial_interview', 'appointment'),
    CONSTRAINT fk_ur_user        FOREIGN KEY (id_user)        REFERENCES users (id_user),
    CONSTRAINT fk_ur_clinic_user FOREIGN KEY (id_clinic_user) REFERENCES users (id_user),
    CONSTRAINT chk_ur_no_autoassignation CHECK (id_user <> id_clinic_user)
);

ALTER TABLE log_record
    ADD CONSTRAINT fk_log_user FOREIGN KEY (id_user) REFERENCES users (id_user);

ALTER TABLE access_role
    ADD CONSTRAINT fk_ar_acl  FOREIGN KEY (id_acl)  REFERENCES acl (id_acl),
    ADD CONSTRAINT fk_ar_role FOREIGN KEY (id_user) REFERENCES users (id_user);
    
-- ============================================================
-- ASSIGNMENTS AND INTERVENTION LOGBOOK
-- ============================================================

CREATE TABLE user_info (
    id_user              VARCHAR(36)  NOT NULL  PRIMARY KEY,
    origin               VARCHAR(40)  NULL,
    neuro_status         VARCHAR(40)  NULL,
    status_act_date      DATETIME     NULL,
    base_patology        VARCHAR(80)  NULL,
    modality             VARCHAR(30)  NULL      COMMENT 'Modality in which the user attends',
    notes                VARCHAR(100) NULL      COMMENT 'Clinical group notes',
    attendance           VARCHAR(80)  NOT NULL,
    initial_interview    INT          NULL      DEFAULT 0 COMMENT 'Status: por comenzar, en proceso, calificado',
	registration_date  DATE         NOT NULL,
    reference_number   VARCHAR(10)  NOT NULL,
    amputation_date    DATE         NOT NULL,
    protocol           ENUM('Research','Clinical', 'Pending') NOT NULL DEFAULT 'Pending', 
    state             ENUM('Discharged','Stand_by', 'Declined', 'Active') NULL, -- estatus
	is_child           BOOL         NOT NULL,
    group_intervention BOOL NOT NULL DEFAULT false,
    amputation_etiology  VARCHAR(80)  NULL,
	laterality          ENUM('right', 'left', 'both') NULL,
    prosthetist		VARCHAR(35) NOT NULL,
    neuro_entry_date DATE NULL,
    amputation_level VARCHAR(50) NOT NULL,
    CONSTRAINT fk_logbook_user FOREIGN KEY (id_user) REFERENCES users (id_user)
);


-- ============================================================
-- APPOINTMENT
-- ============================================================

CREATE TABLE appointment (
	id_appointment VARCHAR(36) NOT NULL PRIMARY KEY,
	id_user_relation VARCHAR(36)  NOT NULL,
    issue VARCHAR(50) NOT NULL,
    date_time DATETIME NOT NULL,
    CONSTRAINT fk_appointment_user_relation FOREIGN KEY (id_user_relation) REFERENCES user_relation (id_user_relation)
    );

-- ============================================================
-- FORUM
-- ============================================================

CREATE TABLE publication (
    id_publication  VARCHAR(36)   NOT NULL PRIMARY KEY,
    id_user         VARCHAR(36)   NOT NULL,
    time_and_date   DATETIME      NULL,
    title           VARCHAR(50)   NOT NULL,
    content         VARCHAR(500)  NOT NULL,
    image           VARCHAR(255)  NULL,
    CONSTRAINT fk_publication_user FOREIGN KEY (id_user) REFERENCES users (id_user)
);

CREATE TABLE interaction (
    id_interaction  VARCHAR(36)   NOT NULL PRIMARY KEY,
    id_user         VARCHAR(36)   NOT NULL,
    id_publication  VARCHAR(36)   NOT NULL,
    is_like         BOOL          NOT NULL DEFAULT 0,
    content         VARCHAR(250)  NULL,
    date_and_time   DATE          NOT NULL,
    CONSTRAINT fk_interaction_user FOREIGN KEY (id_user)        REFERENCES users (id_user),
    CONSTRAINT fk_interaction_pub  FOREIGN KEY (id_publication) REFERENCES publication (id_publication)
);

-- ============================================================
-- INITIAL INTERVIEW —
-- ============================================================

CREATE TABLE initial_interview_progress (
    id_user_relation            VARCHAR(36) NOT NULL PRIMARY KEY,
    identification_completed    BOOLEAN NOT NULL DEFAULT 0,
    financial_completed         BOOLEAN NOT NULL DEFAULT 0,
    symptoms_completed          BOOLEAN NOT NULL DEFAULT 0,
	status                      ENUM('to_start','in_progress','completed') 
                                    NOT NULL DEFAULT 'to_start',

    CONSTRAINT fk_iip_user_relation
        FOREIGN KEY (id_user_relation)
        REFERENCES user_relation(id_user_relation)
);

CREATE TABLE initial_interview (
    id_user_relation        VARCHAR(36)  NOT NULL PRIMARY KEY,
    -- Identification card
    interview_date          DATE         NOT NULL,
    companions_name         VARCHAR(50)  NULL,
    companion_relation      VARCHAR(50)  NULL,
    address                 VARCHAR(100) NULL,
    proof_address           VARCHAR(200) NULL,
    healthcare_system       VARCHAR(50)  NULL,
    religion                VARCHAR(30)  NULL,
    weight                  FLOAT NULL,
    size                    FLOAT NULL,
    schooling               ENUM('Sin escolaridad','Primaria','Secundaria','Bachillerato','Licenciatura','Posgrado') NULL,
    fathers_schooling       ENUM('Sin escolaridad','Primaria','Secundaria','Bachillerato','Licenciatura','Posgrado') NULL,
    mothers_schooling       ENUM('Sin escolaridad','Primaria','Secundaria','Bachillerato','Licenciatura','Posgrado') NULL,
    ocupation               VARCHAR(50)  NULL,
    phone_number            VARCHAR(15)  NULL,
    -- Family situation
    in_relationship         BOOL         NULL,
    relationship_duration   INT          NULL,
    partners_name           VARCHAR(50)  NULL,
    partners_age            INT          NULL,
    partners_ocupation      VARCHAR(50)  NULL,
    partners_health         VARCHAR(150) NULL,
    has_children            BOOL         NULL,
    childrens_names         VARCHAR(150) NULL,
    number_family_members   INT          NULL,
    roomie_info             VARCHAR(150) NULL,
    aditional_info          VARCHAR(400) NULL,
    -- Employment situation
    has_job                 BOOL         NULL,
    work_activity           VARCHAR(150) NULL,
    stress_work             ENUM('Bajo','Medio','Alto') NULL,
    work_problems           VARCHAR(150) NULL,
    employment_status       VARCHAR(150) NULL,
    seniority               INT          NULL,
    employer                VARCHAR(80)  NULL,
    employers_phone_number  VARCHAR(13)  NULL,
    socioeconomic_level     INT          NULL,
    amai_questionnaire      INT          NULL,
    ts_conclusions          VARCHAR(400) NULL,
    CONSTRAINT fk_ii_relation FOREIGN KEY (id_user_relation) REFERENCES user_relation (id_user_relation)
);

-- ============================================================
-- CLINICAL INTERVIEW 
-- ============================================================

CREATE TABLE clinical_interview (
    id_user_relation           VARCHAR(36)  NOT NULL PRIMARY KEY,
    -- General physical concerns
    headache                   VARCHAR(100) NULL,
    dizziness                  VARCHAR(100) NULL,
    nausea_vomiting            VARCHAR(100) NULL,
    excessive_fatigue          VARCHAR(100) NULL,
    urinary_inconsistency      VARCHAR(100) NULL,
    bladder_problem            VARCHAR(100) NULL,
    skin_problem               VARCHAR(100) NULL,
    intestinal_problem         VARCHAR(100) NULL,
    -- Motor
    weakness                   VARCHAR(100) NULL,
    movement_problem           VARCHAR(100) NULL,
    tremor                     VARCHAR(100) NULL,
    tics                       VARCHAR(100) NULL,
    balance_problems           VARCHAR(100) NULL,
    falls                      VARCHAR(100) NULL,
    -- Sensory
    sensation_loss             VARCHAR(100) NULL,
    tingle                     VARCHAR(100) NULL,
    distinguish_heat_cold      VARCHAR(100) NULL,
    vision_dif                 VARCHAR(100) NULL,
    wears_glasses              VARCHAR(100) NULL,
    problem_one_eye            VARCHAR(100) NULL,
    bright_lights_sensitivity  VARCHAR(100) NULL,
    blurry_vision              VARCHAR(100) NULL,
    see_things                 VARCHAR(100) NULL,
    short_blindness            VARCHAR(100) NULL,
    short_vision               VARCHAR(100) NULL,
    hearing_loss               VARCHAR(100) NULL,
    ringing_ears               VARCHAR(100) NULL,
    strange_noises             VARCHAR(100) NULL,
    noticing_near              VARCHAR(100) NULL,
    taste_problem              VARCHAR(100) NULL,
    smell_problem              VARCHAR(100) NULL,
    pain                       VARCHAR(100) NULL,
    phantom_limb               VARCHAR(100) NULL,
    phantom_limb_desc          VARCHAR(100) NULL,
    phantom_limb_pain          VARCHAR(100) NULL,
    phantom_limb_pain_desc     VARCHAR(100) NULL,
    pain_aside                 VARCHAR(100) NULL,
    -- Thought
    new_things                 VARCHAR(100) NULL,
    thinking_problems          VARCHAR(100) NULL,
    planning_dif               VARCHAR(100) NULL,
    changing_plans_dif         VARCHAR(100) NULL,
    fast_thinking_dif          VARCHAR(100) NULL,
    finishing_act_dif          VARCHAR(100) NULL,
    sequence_dif               VARCHAR(100) NULL,
    -- Communication and mathematical skills
    word_difficulty            VARCHAR(100) NULL,
    drags_words                VARCHAR(100) NULL,
    weird_noises               VARCHAR(100) NULL,
    expression_dif             VARCHAR(100) NULL,
    understandig_dif           VARCHAR(100) NULL,
    reading_dif                VARCHAR(100) NULL,
    writting_dif               VARCHAR(100) NULL,
    mathematics_dif            VARCHAR(100) NULL,
    other_math                 VARCHAR(200) NULL,
    -- Non-verbal activities
    left_right_dif             VARCHAR(100) NULL,
    drawing_dif                VARCHAR(100) NULL,
    dressing_dif               VARCHAR(100) NULL,
    automatic_dif              VARCHAR(100) NULL,
    orientation_dif            VARCHAR(100) NULL,
    recognition_dif            VARCHAR(100) NULL,
    body_not_belong            VARCHAR(100) NULL,
    muscle_decrease            VARCHAR(100) NULL,
    time_dif                   VARCHAR(100) NULL,
    slow_reaction              VARCHAR(100) NULL,
    -- Alertness and concentration
    get_distracted             VARCHAR(100) NULL,
    lost_train                 VARCHAR(100) NULL,
    blank_mind                 VARCHAR(100) NULL,
    multitasking_dif           VARCHAR(100) NULL,
    confusion                  VARCHAR(100) NULL,
    auras                      VARCHAR(100) NULL,
    reduced_alertness          VARCHAR(100) NULL,
    requires_effort            VARCHAR(100) NULL,
    -- Memory
    forget_objects             VARCHAR(100) NULL,
    forget_names               VARCHAR(100) NULL,
    forget_tasks               VARCHAR(100) NULL,
    forget_place               VARCHAR(100) NULL,
    forget_identity            VARCHAR(100) NULL,
    forget_recent              VARCHAR(100) NULL,
    forget_appointments        VARCHAR(100) NULL,
    forget_past                VARCHAR(100) NULL,
    depend_people              VARCHAR(100) NULL,
    depend_notes               VARCHAR(100) NULL,
    forget_order               VARCHAR(100) NULL,
    forget_how                 VARCHAR(100) NULL,
    forget_faces               VARCHAR(100) NULL,
    other_memory               VARCHAR(200) NULL,
    -- Personality
    depression                 VARCHAR(100) NULL,
    anxiety                    VARCHAR(100) NULL,
    stress                     VARCHAR(100) NULL,
    sleeping_problems          VARCHAR(100) NULL,
    nightmares                 VARCHAR(100) NULL,
    easily_angry               VARCHAR(100) NULL,
    euphoria                   VARCHAR(100) NULL,
    very_emotional             VARCHAR(100) NULL,
    frustrated_easily          VARCHAR(100) NULL,
    less_inhibited             VARCHAR(100) NULL,
    spontaneous_dif            VARCHAR(100) NULL,
    energy_changes             VARCHAR(100) NULL,
    weight                     VARCHAR(100) NULL,
    sexual_interest_change     VARCHAR(100) NULL,
    more_irritable             VARCHAR(100) NULL,
    more_aggressive            VARCHAR(100) NULL,
    other_changes              VARCHAR(200) NULL,
    changes_comments           VARCHAR(100) NULL,
    -- General context
    family_problem             VARCHAR(100) NULL,
    legal_problem              VARCHAR(100) NULL,
    legal_problem_desc         VARCHAR(100) NULL,
    finance_problem            VARCHAR(100) NULL,
    driving_problem            VARCHAR(100) NULL,
    control_problems           VARCHAR(100) NULL,
    aggravatings               VARCHAR(100) NULL,
    -- Substance use
    cigarette_consumption      VARCHAR(100) NULL,
    alcohol_consumption        VARCHAR(100) NULL,
    drug_consumption           VARCHAR(100) NULL,
    -- Previous therapy
    has_attended_therapy       VARCHAR(100) NULL,
    therapy_type               VARCHAR(100) NULL,
    therapy_duration           VARCHAR(100) NULL,
    -- Closure
    positive_experience        VARCHAR(300) NULL,
    future_goals               VARCHAR(300) NULL,
    observations               VARCHAR(400) NULL,
    psychology_notes           VARCHAR(500) NULL,
    CONSTRAINT fk_ci_relation FOREIGN KEY (id_user_relation) REFERENCES user_relation (id_user_relation)
);

-- ============================================================
-- Interview child file
-- ============================================================

CREATE TABLE child_interview (
    id_user_relation          VARCHAR(36)  NOT NULL PRIMARY KEY,
    -- Child identification file
    full_name                 VARCHAR(150) NULL,
    bmi                       DECIMAL(5,2) NULL,
    schooling                 VARCHAR(100) NULL,
    school_name               VARCHAR(100) NULL,
    ocupation                 VARCHAR(100) NULL,
    laterality                VARCHAR(50)  NULL,
    medical_eligibility       VARCHAR(100) NULL,
    -- Family data
    mothers_name              VARCHAR(150) NULL,
    mothers_age               INT          NULL,
    mothers_schooling         VARCHAR(100) NULL,
    mothers_profession        VARCHAR(100) NULL,
    mothers_occpation         VARCHAR(100) NULL,
    fathers_name              VARCHAR(150) NULL,
    fathers_age               INT          NULL,
    fathers_schooling         VARCHAR(100) NULL,
    fathers_profession        VARCHAR(100) NULL,
    fathers_occupation        VARCHAR(100) NULL,
    marital_status            VARCHAR(50)  NULL,
    religion                  VARCHAR(50)  NULL,
    parental_authority        VARCHAR(200) NULL,
    separation_age            INT          NULL,
    number_siblings           INT          NULL,
    -- Neuro-familial background
    neurological              VARCHAR(150) NULL,
    psychiatric               VARCHAR(150) NULL,
    drug_addictions           VARCHAR(150) NULL,
    law_conduct               VARCHAR(150) NULL,
    cognitive_development     VARCHAR(150) NULL,
    speech                    VARCHAR(150) NULL,
    similar_familiar          VARCHAR(150) NULL,
    -- Medical history
    tbi                       VARCHAR(500) NULL,
    hospitalized              VARCHAR(500) NULL,
    seizure                   VARCHAR(500) NULL,
    infectious                VARCHAR(500) NULL,
    alergies                  VARCHAR(500) NULL,
    intoxication              VARCHAR(500) NULL,
    -- Prenatal history
    not_gestate               INT          NULL,
    misscarriage_number       INT          NULL,
    csection                  INT         NULL,
    labors                    INT          NULL,
    wanted                    BOOL         NULL,
    planned                   BOOL         NULL,
    moms_age                  INT          NULL,
    dads_age                  INT          NULL,
    conceive_dif              BOOL         NULL,
    conception_type           VARCHAR(100) NULL,
    obstetric_surveillance    BOOL         NULL,
    control_numbers           INT          NULL,
    abortion_risk             BOOL         NULL,
    premature_risk            BOOL         NULL,
    emotional_state           VARCHAR(100) NULL,
    feeding                   VARCHAR(100) NULL,
    diseases                  VARCHAR(100) NULL,
    medications               VARCHAR(100) NULL,
    exposures                 VARCHAR(100) NULL,
    -- General development background
    babbling_age              INT          NULL,
    first_word_age            INT          NULL,
    first_word                VARCHAR(15)  NULL,
    first_sentence            VARCHAR(50)  NULL,
    talk_strangers            BOOL         NULL,
    language_pairs            VARCHAR(100) NULL,
    expressed_ideas           VARCHAR(100) NULL,
    spoken_comprehension      VARCHAR(100) NULL,
    lenguaje_therapy          BOOL         NULL,
    therapy_info              VARCHAR(100) NULL,
    -- Motor development
    head_support              VARCHAR(100) NULL,
    turn                      VARCHAR(100) NULL,
    seating                   VARCHAR(100) NULL,
    crawl                     VARCHAR(100) NULL,
    standing                  VARCHAR(100) NULL,
    motion                    VARCHAR(100) NULL,
    practices_sports          VARCHAR(100) NULL,
    trimming                  VARCHAR(100) NULL,
    letter_legibility         ENUM('Legible','Poco legible','Ilegible') NULL,
    motor_coordination        VARCHAR(100) NULL,
    bicyle                    VARCHAR(100) NULL,
    movement_problems         VARCHAR(100) NULL,
    -- Social conduct
    temper                    VARCHAR(100) NULL,
    social_smile              VARCHAR(100) NULL,
    object_permanence         VARCHAR(100) NULL,
    affection_demonstration   VARCHAR(100) NULL,
    conduct_strangers         VARCHAR(100) NULL,
    childs_conduct            VARCHAR(100) NULL,
    has_friends               VARCHAR(100) NULL,
    friends_to_home           VARCHAR(100) NULL,
    invited_to_party          BOOL         NULL,
    other_sex_interest        BOOL         NULL,
    how_plays                 VARCHAR(100) NULL,
    freetime_activity         VARCHAR(100) NULL,
    electronics               BOOL         NULL,
    follows_games_rules       BOOL         NULL,
    new_situation_adaptation  VARCHAR(100) NULL,
    -- General conduct
    by_themselves_age         INT          NULL,
    helps_at_home             VARCHAR(50)  NULL,
    to_do                     VARCHAR(100) NULL,
    how_eats                  VARCHAR(100) NULL,
    daily_meals               INT          NULL,
    picky_eater               VARCHAR(100) NULL,
    food_not_consumed         VARCHAR(100) NULL,
    non_food_substances       VARCHAR(100) NULL,
    feeding_behavior          VARCHAR(100) NULL,
    sleep_routine             VARCHAR(100) NULL,
    sleep_hours               VARCHAR(100) NULL,
    continuous_sleep          VARCHAR(100) NULL,
    naps                      INT          NULL,
    sph_control_age           INT          NULL,
    sph_method                INT          NULL,
    daytime_sph_ctrl_age      INT          NULL,
    sph_regression            VARCHAR(100) NULL,
    type_home_discipline      VARCHAR(100) NULL,
    authority_figure          VARCHAR(100) NULL,
    dis_scolding              INT          NULL COMMENT '0=Nunca 1=Casi nunca 2=Casi siempre 3=Siempre',
    dis_physical_punishment   INT          NULL,
    dis_timeout               INT          NULL,
    dis_treat                 INT          NULL,
    dis_convincing            INT          NULL,
    dis_other                 VARCHAR(100) NULL,
    resp_dis_methods          VARCHAR(100) NULL,
    acuerdo_cons_partner      VARCHAR(50)  NULL,
    dis_area_challenges       VARCHAR(100) NULL,
    -- School history
    school_starting_age       INT          NULL,
    school_performance        VARCHAR(100) NULL,
    preschool                 VARCHAR(400) NULL,
    primary_school            VARCHAR(400) NULL,
    junior_high               VARCHAR(400) NULL,
    highschool                VARCHAR(400) NULL,
    school_interest           VARCHAR(400) NULL,
    school_aptitudes          VARCHAR(100) NULL,
    failed_year               VARCHAR(50)  NULL,
    particular_classes        VARCHAR(100) NULL,
    part_classes_time         VARCHAR(50)  NULL,
    extracur_act              VARCHAR(100) NULL,
    -- Pediatric physical examination
    weight                    INT          NULL,
    size                      FLOAT        NULL,
    wc                        VARCHAR(50)  NULL,
    temperature               FLOAT        NULL,
    bp                        VARCHAR(50)  NULL,
    oxygenation               FLOAT        NULL,
    alergies_dermatitis       VARCHAR(100) NULL,
    functional_support        VARCHAR(100) NULL,
    good_hearing              VARCHAR(100) NULL,
    concern_listen            VARCHAR(100) NULL,
    audiometry                BOOL         NULL,
    sees_well                 VARCHAR(100) NULL,
    needs_glasses             BOOL         NULL,
    result                    VARCHAR(100) NULL,
    CONSTRAINT fk_chi_relation FOREIGN KEY (id_user_relation) REFERENCES user_relation (id_user_relation)
);

-- ============================================================
-- Financial situation
-- ============================================================

CREATE TABLE financial_progress (
    id_user_relation      VARCHAR(36) NOT NULL PRIMARY KEY,

    current_section       TINYINT NOT NULL DEFAULT 1,

    income_completed      BOOLEAN NOT NULL DEFAULT 0,
    expenses_completed    BOOLEAN NOT NULL DEFAULT 0,
    esc_completed         BOOLEAN NOT NULL DEFAULT 0,
    amai_completed        BOOLEAN NOT NULL DEFAULT 0,
    status                ENUM('to_start','in_progress','completed')
                               NOT NULL DEFAULT 'to_start',

    CONSTRAINT fk_fp_user_relation
        FOREIGN KEY (id_user_relation)
        REFERENCES user_relation(id_user_relation)
);

CREATE TABLE financial_situation (
	id_user_relation             VARCHAR(36)   NOT NULL PRIMARY KEY,
    financial_type               VARCHAR(300)  NULL,
    salary_before_sickness       INT           NULL,
    salary_after_sickness        INT           NULL,
    food_expenses                INT           NULL,
    rent_expenses                INT           NULL,
    services_expenses            INT           NULL,
    gas_expenses                 INT           NULL,
    education_expenses           INT           NULL,
    wardrobe_expenses            INT           NULL,
    medical_expenses             INT           NULL,
    transport_expenses           INT           NULL,
    creditcard_payment_expenses  INT           NULL,
    phone_expenses               INT           NULL,
    others_expenses              INT           NULL,
    has_financing_schoolarship   INT           NULL,
    total_expenses               INT           NULL,
    total_income                 INT           NULL,
    economic_situation           Varchar(150)  NULL,
    num_economic_dependents      INT           NULL,
    protesis_budget              INT           NULL,
    CONSTRAINT fk_fs_relation FOREIGN KEY (id_user_relation) REFERENCES user_relation (id_user_relation)
);

CREATE TABLE contributing_people (
	id_user_relation  VARCHAR(36)   NOT NULL,
    contributor       VARCHAR(100)  NOT NULL,
    relation          VARCHAR(30)   NOT NULL,
    income            INT           NOT NULL,
    CONSTRAINT fk_cp_relation FOREIGN KEY (id_user_relation) REFERENCES user_relation (id_user_relation)
);

CREATE TABLE amai_questionnaire (
    id_user_relation     VARCHAR(36)   NOT NULL PRIMARY KEY,
    last_studies         VARCHAR(150)  NULL,
    num_bathrooms        INT           NULL,
    num_car              INT           NULL,
    has_internet         INT           NULL,
    has_worked           INT           NULL,
    has_bedroom          INT           NULL,
    total                INT           NULL,
    socioeconomic_level  CHAR          NULL,
    CONSTRAINT fk_aq_relation FOREIGN KEY (id_user_relation) REFERENCES user_relation (id_user_relation)
);

CREATE TABLE esc_government (
    id_user_relation       VARCHAR(36)  NOT NULL PRIMARY KEY,
    min_income             INT          NULL,
    ocupation              VARCHAR(50)  NULL,
    family_expenses        INT          NULL,
    real_right             INT          NULL,
    housing_type           INT          NULL,
    public_services        INT          NULL,
    inhome_services        INT          NULL,
    construction_material  INT          NULL,
    num_bedrooms           INT          NULL,
    persons_per_bedroom    INT          NULL,
    treatment_time         INT          NULL,
    other_problems         INT          NULL,
    family_health          INT          NULL,
    total                  INT          NULL,
    socioeconomic_level    VARCHAR(3)   NULL,
    CONSTRAINT fk_eg_relation FOREIGN KEY (id_user_relation) REFERENCES user_relation (id_user_relation)
);

-- ============================================================
-- Siblings
-- ============================================================

CREATE TABLE sibling (
    id_sibling         VARCHAR(36)  NOT NULL PRIMARY KEY,
    id_user            VARCHAR(36)  NOT NULL,
    sibling_name       VARCHAR(100) NULL,
    age                INT          NULL,
    schooling          VARCHAR(100) NULL,
    school_occupation  VARCHAR(150) NULL,
    CONSTRAINT fk_sibling_user FOREIGN KEY (id_user) REFERENCES users (id_user)
);

-- ===========================================================
-- TESTS
-- ===========================================================

CREATE TABLE test_sessions (
	id_session VARCHAR(36) NOT NULL PRIMARY KEY,
    id_user VARCHAR(36) NOT NULL,
    session_name VARCHAR(50) NOT NULL,
    status INT NOT NULL DEFAULT 6,
    created_at DATE NOT NULL,
    CONSTRAINT fk_test_sessions FOREIGN KEY (id_user) REFERENCES users (id_user)
    );

CREATE TABLE psych_tests (
	id_test INT NOT NULL PRIMARY KEY,
    test_name VARCHAR(50) NOT NULL);
    
CREATE TABLE test_results (
	id_results VARCHAR(36) NOT NULL PRIMARY KEY,
    id_user VARCHAR(36) NOT NULL,
    id_session VARCHAR(36) NOT NULL,
    id_test INT NOT NULL,
    status INT NOT NULL DEFAULT 6,
    score INT  NULL,
    interpretation VARCHAR(200) NULL,
    date_applied date NULL,
    notes TEXT NULL,
    CONSTRAINT fk_results_user FOREIGN KEY (id_user) REFERENCES users (id_user),
	CONSTRAINT fk_results_test FOREIGN KEY (id_test) REFERENCES psych_tests (id_test),
    CONSTRAINT fk_resullts_session FOREIGN KEY (id_session) REFERENCES test_sessions (id_session)
    );

CREATE TABLE protocol_tests (
	id_protocol_test INT NOT NULL PRIMARY KEY auto_increment,
    protocol ENUM('Research','Clinical') NOT NULL,
    id_test INT NOT NULL,
	CONSTRAINT fk_protocol_tests FOREIGN KEY (id_test) REFERENCES psych_tests (id_test)
    );

ALTER TABLE user_info
ADD COLUMN unit_entry_date DATE NULL AFTER registration_date;

ALTER TABLE user_info
ADD COLUMN stage ENUM('Evaluation', 'Initial', 'Following', 'Graduation') NOT NULL DEFAULT 'Evaluation';

ALTER TABLE acl CHANGE writting writing BOOL NOT NULL;

CREATE TABLE user_clinical (
    id_user      VARCHAR(36) NOT NULL PRIMARY KEY,
    affiliation  VARCHAR(20) NULL ,
    activity     VARCHAR(20) NULL ,
    CONSTRAINT fk_user_clinical_user FOREIGN KEY (id_user) REFERENCES users (id_user)
);

ALTER TABLE users 
ADD COLUMN gender enum('Man','Woman','Other','not especified') 
NULL AFTER birthdate;

ALTER TABLE test_sessions RENAME TO test_applications;

ALTER TABLE test_results 
ALTER COLUMN status SET DEFAULT 1;

ALTER TABLE test_applications 
ALTER COLUMN status SET DEFAULT 1;

ALTER TABLE test_applications 
RENAME COLUMN id_session TO id_application;

ALTER TABLE test_applications 
RENAME COLUMN session_name TO application_name;

ALTER TABLE test_results 
DROP FOREIGN KEY fk_resullts_session;

ALTER TABLE test_results 
RENAME COLUMN id_session TO id_application; 

ALTER TABLE test_results 
ADD CONSTRAINT fk_results_application 
FOREIGN KEY (id_application) REFERENCES test_applications (id_application);

ALTER TABLE user_clinical
    ADD COLUMN emergency_contact_name varchar(50) NOT NULL,
    ADD COLUMN emergency_contact_phone VARCHAR(15) NOT NULL,
    ADD COLUMN emergency_contact_relation VARCHAR(25) NOT NULL,
    ADD COLUMN start_date DATE NOT NULL,
    ADD COLUMN finish_date DATE NOT NULL, 
    ADD COLUMN hours INT NOT NULL;


-- ===========================================================
-- Test changes
-- ===========================================================
 
ALTER TABLE test_results
DROP COLUMN score;
 
ALTER TABLE test_results
DROP COLUMN interpretation;

ALTER TABLE test_results
DROP COLUMN notes;
 
ALTER TABLE psych_tests
ADD COLUMN result_table VARCHAR(50) NOT NULL;
 
-- -----------------------------------------------------------
-- BANFE
-- -----------------------------------------------------------
CREATE TABLE banfe_results (
    id_banfe                    INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_results                  VARCHAR(36)  NOT NULL UNIQUE,
    score_orbit_frontal         DECIMAL(5,2) NULL,
    inter_orbit_frontal         VARCHAR(36),
    score_prefrontal_before     DECIMAL(5,2) NULL,
    inter_prefrontal_before     VARCHAR(36),
    score_d_lateral             DECIMAL(5,2) NULL,
    inter_d_lateral             VARCHAR(36),
    score_total                 DECIMAL(5,2) NULL,
    notes                       VARCHAR(200),
    CONSTRAINT fk_banfe_results FOREIGN KEY (id_results) REFERENCES test_results (id_results)
);


-- -----------------------------------------------------------
-- WAIS
-- -----------------------------------------------------------
CREATE TABLE wais_results (
    id_wais                  INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_results               VARCHAR(36)  NOT NULL UNIQUE,
    score_com_verbal         DECIMAL(5,2) NULL,
    inter_com_verbal         VARCHAR(36),
    score_razon_perceptual   DECIMAL(5,2) NULL,
    inter_razon_perceptual   VARCHAR(36),
    score_mem_work           DECIMAL(5,2) NULL,
    inter_mem_work           VARCHAR(36),
    score_velo_proce         DECIMAL(5,2) NULL,
    inter_velo_proce         VARCHAR(36),
    score_total              DECIMAL(5,2) NULL,
    inter_total        VARCHAR(36),
    notes                       VARCHAR(200),
    CONSTRAINT fk_wais_results FOREIGN KEY (id_results) REFERENCES test_results (id_results)
);

-- -----------------------------------------------------------
-- MOCA
-- -----------------------------------------------------------
CREATE TABLE moca_results (
    id_moca                  INT         NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_results               VARCHAR(36) NOT NULL UNIQUE,
    score                    INT NOT NULL,
    interpretation VARCHAR(36),
    notes                       VARCHAR(200),
    CONSTRAINT fk_moca_results FOREIGN KEY (id_results) REFERENCES test_results (id_results)
);

-- -----------------------------------------------------------
-- NIH 
-- -----------------------------------------------------------
CREATE TABLE nih_results (
    id_nih                    INT         NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_results                VARCHAR(36) NOT NULL UNIQUE,
    notes                       VARCHAR(500),
    CONSTRAINT fk_nih_results FOREIGN KEY (id_results) REFERENCES test_results (id_results)
);
 
-- -----------------------------------------------------------
-- REY
-- -----------------------------------------------------------
CREATE TABLE rey_results (
    id_rey                    INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_results                VARCHAR(36)  NOT NULL UNIQUE,
    score_rc                  DECIMAL(5,2) NULL,
    pc_rc                     INT          NULL,
    time_rc                   DECIMAL(5,2) NULL,
    pc_time_rc                INT          NULL,
    score_mcp                 DECIMAL(5,2) NULL,
    pc_mcp                    INT          NULL,
    time_mcp                  DECIMAL(5,2) NULL,
    pc_time_mcp               INT          NULL,
    score_mlp                 DECIMAL(5,2) NULL,
    pc_mlp                    INT          NULL,
    time_mlp                  DECIMAL(5,2) NULL,
    pc_time_mlp               INT          NULL,
    notes                       VARCHAR(200),
    CONSTRAINT fk_rey_results FOREIGN KEY (id_results) REFERENCES test_results (id_results)
);
 