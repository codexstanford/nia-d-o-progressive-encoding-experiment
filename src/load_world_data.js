
// Loads the data common to all D&O Liability insurance claims into localstorage
function load_world_data() {
    localStorage.setItem('worldData', world_data_text);
}

let world_data_text = `
type(nia_d_o_liability, product)
type(yes, boolean)
type(no, boolean)

type(organization, claimant_type)
type(director, claimant_type)
type(trustee, claimant_type)
type(elected_or_appointed_officer, claimant_type)
type(committee_member, claimant_type)
type(volunteer, claimant_type)
type(spouse_or_domestic_partner_of_member, claimant_type)
type(deceased_member, claimant_type)
type(estate_heirs_or_legal_rep_of_deceased_member, claimant_type)
type(existing_subsidiary, claimant_type)
type(new_subsidiary, claimant_type)
type(successor_org, claimant_type)
type(other_claimant_type, claimant_type)

type(personal_injury, wrongful_act_result_type)
type(claim_of_harassment_or_discrimination_brought_by_volunteer, wrongful_act_result_type)
type(claim_of_harassment_or_discrimination_brought_by_third_party_business_invitee, wrongful_act_result_type)
type(other_nonexcluded_result, wrongful_act_result_type)
type(other_excluded_result, wrongful_act_result_type)`;