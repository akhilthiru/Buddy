-- Migration DOWN: 001_initial_schema.down.sql
-- Description: Completely and cleanly roll back initial Flatmate schema

BEGIN;

DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS user_reports CASCADE;
DROP TABLE IF EXISTS user_blocks CASCADE;
DROP TABLE IF EXISTS room_photos CASCADE;
DROP TABLE IF EXISTS room_listings CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS discovery_swipes CASCADE;
DROP TABLE IF EXISTS lifestyle_profiles CASCADE;
DROP TABLE IF EXISTS profile_photos CASCADE;
DROP TABLE IF EXISTS profile_preferred_suburbs CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS institution_verifications CASCADE;
DROP TABLE IF EXISTS auth_otps CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS trivandrum_suburbs CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

DROP TYPE IF EXISTS report_status_enum CASCADE;
DROP TYPE IF EXISTS report_category_enum CASCADE;
DROP TYPE IF EXISTS bathroom_type_enum CASCADE;
DROP TYPE IF EXISTS room_type_enum CASCADE;
DROP TYPE IF EXISTS message_status CASCADE;
DROP TYPE IF EXISTS conversation_status CASCADE;
DROP TYPE IF EXISTS match_status CASCADE;
DROP TYPE IF EXISTS swipe_action_type CASCADE;

DROP TYPE IF EXISTS workspace_preference_type CASCADE;
DROP TYPE IF EXISTS call_frequency_type CASCADE;
DROP TYPE IF EXISTS work_mode_type CASCADE;
DROP TYPE IF EXISTS grocery_tracking_type CASCADE;
DROP TYPE IF EXISTS ac_bill_split_type CASCADE;
DROP TYPE IF EXISTS rent_payment_habit_type CASCADE;
DROP TYPE IF EXISTS alcohol_habit_type CASCADE;
DROP TYPE IF EXISTS smoking_habit_type CASCADE;
DROP TYPE IF EXISTS party_preference_type CASCADE;
DROP TYPE IF EXISTS overnight_guest_policy_type CASCADE;
DROP TYPE IF EXISTS guest_frequency_type CASCADE;
DROP TYPE IF EXISTS kitchen_policy_type CASCADE;
DROP TYPE IF EXISTS diet_type_type CASCADE;
DROP TYPE IF EXISTS maid_preference_type CASCADE;
DROP TYPE IF EXISTS kitchen_sink_rule_type CASCADE;
DROP TYPE IF EXISTS cleanliness_level_type CASCADE;
DROP TYPE IF EXISTS noise_sensitivity_type CASCADE;
DROP TYPE IF EXISTS shift_schedule_type CASCADE;
DROP TYPE IF EXISTS sleep_pattern_type CASCADE;

DROP TYPE IF EXISTS verification_status_enum CASCADE;
DROP TYPE IF EXISTS institution_type_enum CASCADE;
DROP TYPE IF EXISTS verification_badge_type CASCADE;
DROP TYPE IF EXISTS move_in_flexibility CASCADE;
DROP TYPE IF EXISTS discovery_modality CASCADE;
DROP TYPE IF EXISTS preferred_gender_type CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;

COMMIT;
