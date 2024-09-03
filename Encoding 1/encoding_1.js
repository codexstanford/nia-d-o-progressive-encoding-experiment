const POLICY_ID_INPUT_ID = "policy_id_input";
const CLAIM_ID_INPUT_ID = "claim_id_input";

const INPUT_FIELD_IDS_TO_FACT_TEMPLATES = {
  "policy_startdate_input" : "policy.startdate($POLICY$, $VALUE$)",
  "policy_enddate_input" : "policy.enddate($POLICY$, $VALUE$)",
  "policy_canceled_input" : "policy.canceled($POLICY$, $VALUE$)",
  
  "claimant_id_input" : "claim.claimant($CLAIM$, $VALUE$)",

  "claimant_org_input" : "claim.claimant_org($CLAIM$, $VALUE$)",
  "org_is_organized_for_charitable_services_input" : "claim.organization_organized_chiefly_to_provide_charitable_religious_educational_scientific_health_or_human_services($CLAIM$, $VALUE$)",
  "org_is_501c3_input" : "claim.organization_is_501c3_or_corresponding($CLAIM$, $VALUE$)",
  "org_incorporated_in_california_input" : "claim.organization_incorporated_or_qualified_to_do_business_in_california($CLAIM$, $VALUE$)",

  "claimant_type_input" : "claim.claimant_type($CLAIM$, $VALUE$)",
  "member_voluntarility_paid_or_admitted_liability_input" : "claim.member_voluntarily_made_payment_admitted_liability_or_incurred_defense_costs_without_insuring_company_prior_written_consent($CLAIM$, $VALUE$)",
  "wrongful_act_committed_by_spouse_input" : "claim.wrongful_act_committed_by_spouse_or_domestic_partner_of_member($CLAIM$, $VALUE$)",
  "claim_arose_out_of_acts_taken_solely_in_capacity_as_member_input" : "claim.claim_against_member_arose_out_of_acts_taken_solely_in_capacity_as_such($CLAIM$, $VALUE$)",
  "each_member_cooperated_input" : "claim.each_member_has_cooperated($CLAIM$, $VALUE$)",
  "each_member_promptly_gave_notice_regarding_wrongful_act_input" : "claim.each_member_promptly_gave_notice_to_insuring_company_of_claim_for_wrongful_act_committed_during_policy_period($CLAIM$, $VALUE$)",
  "each_member_promptly_gave_notice_of_claim_input" : "claim.each_member_promptly_gave_written_notice_to_insuring_company_of_actual_or_potential_claim_and_gave_required_info_and_cooperation($CLAIM$, $VALUE$)",
  "all_representations_in_application_are_true_input" : "claim.all_representations_and_statements_in_application_for_policy_are_true($CLAIM$, $VALUE$)",
  "suits_merits_determined_in_usa_input" : "claim.responsibility_to_pay_damages_determined_in_suit_on_merits_determined_in_usa($CLAIM$, $VALUE$)",
  "transferred_rights_of_payment_recovery_input" : "claim.transferred_rights_of_payment_recovery_to_insuring_company($CLAIM$, $VALUE$)",

  "new_subsidiary_is_501c3_input" : "claim.new_subsidiary_is_501c3($CLAIM$, $VALUE$)",
  "new_subsidiary_written_notice_input" : "claim.new_subsidiary_written_notice_given_to_insuring_company($CLAIM$, $VALUE$)",
  "new_subsidiary_underwriting_info_given_input" : "claim.new_subsidiary_underwriting_info_given_to_insuring_company($CLAIM$, $VALUE$)",
  "new_subsidiary_additional_premium_given_input" : "claim.new_subsidiary_additional_premium_given_to_insuring_company($CLAIM$, $VALUE$)",
  "new_subsidiary_written_approval_received_input" : "claim.new_subsidiary_written_approval_received_from_insuring_company($CLAIM$, $VALUE$)",

  "successor_written_notice_given_input" : "claim.merger_consolidation_or_acquisition_written_notice_and_information_given_to_insuring_company($CLAIM$, $VALUE$)",
  "successor_additional_premium_given_input" : "claim.merger_consolidation_or_acquisition_additional_premium_given_to_insuring_company($CLAIM$, $VALUE$)",

  "wrongful_act_date_input" : "claim.date_of_wrongful_act($CLAIM$, $VALUE$)",
  "wrongful_act_was_valid_type_input" : "claim.resulted_from_breach_of_duty_error_neglect_omission_or_act($CLAIM$, $VALUE$)",
  "wrongful_act_committed_solely_in_course_of_activities_of_org_input" : "claim.wrongful_act_committed_solely_in_course_of_activities_of_org($CLAIM$, $VALUE$)",
  "wrongful_act_result_type_input" : "claim.wrongful_act_result_type($CLAIM$, $VALUE$)",

  "monetary_damages_sought_input" : "claim.monetary_damages_sought($CLAIM$, $VALUE$)",
  "monetary_damages_are_compensatory_damages_input" : "claim.monetary_damages_consist_of_judgment_for_compensatory_damages($CLAIM$, $VALUE$)",
  "monetary_damages_solely_excluded_type_input" : "claim.monetary_damages_solely_consist_of_taxes_severance_reimbursements_for_expenses_resulting_from_employment_equitable_or_injunctive_relief_and_or_matters_uninsurable($CLAIM$, $VALUE$)",
};



const INPUT_FIELD_IDS = [POLICY_ID_INPUT_ID, CLAIM_ID_INPUT_ID, ...Object.keys(INPUT_FIELD_IDS_TO_FACT_TEMPLATES)];


window.onload = function() {
  load_world_data();

  build_claims_processing_table();

  init_coverage_indicator();

  add_event_listeners();
};

function update_coverage_indicator() {
  const POLICY_ID_VALUE = document.getElementById(POLICY_ID_INPUT_ID).value;
  const CLAIM_ID_VALUE = document.getElementById(CLAIM_ID_INPUT_ID).value;

  let covers_query = "covers(" + POLICY_ID_VALUE + ", " + CLAIM_ID_VALUE + ")";

  let world_dataset = definemorefacts([], readdata(localStorage["worldDataEncodingLevel1"]));
  let combined_dataset = definemorefacts(world_dataset, get_data_from_input_fields());
  
    console.log(grindem(combined_dataset));

  let coverage_indicator = document.getElementById("coverage-indicator");

  let coverage = compfinds('covered', read(covers_query), combined_dataset, definemorerules([], readdata(policy_rules)));

  if (coverage.length === 0) {
    coverage_indicator.innerHTML = "<td colspan=\"2\">Not Covered</td>";
    coverage_indicator.classList.add("covered-false");
    coverage_indicator.classList.remove("covered-true");
  } else {
    coverage_indicator.innerHTML = "<td colspan=\"2\">Covered</td>";
    coverage_indicator.classList.add("covered-true");
    coverage_indicator.classList.remove("covered-false");
  }
}

function init_coverage_indicator() {
  update_coverage_indicator(); 
}

function add_event_listeners() {

  // Update the coverage indicator if any of the input fields change value.
  for (const INPUT_FIELD_ID of INPUT_FIELD_IDS) {
    const INPUT_FIELD_WIDGET = document.getElementById(INPUT_FIELD_ID);
    
    INPUT_FIELD_WIDGET.addEventListener("change", () => update_coverage_indicator());
  }

  add_visibility_changing_event_listeners();
  add_disable_toggling_event_listeners();
}

function add_visibility_changing_event_listeners() {
}

function add_row_visibility_toggle_event_listener(togglingElemID, toggledClass, toggleCondition) {
  document.getElementById(togglingElemID).addEventListener("change", function() {
    let elemsToChangeVisibilityOf = document.getElementsByClassName(toggledClass);
    if (toggleCondition(this)) {
      for (let elem of elemsToChangeVisibilityOf) {
        elem.style.display = "table-row";
      }
    } else {
      for (let elem of elemsToChangeVisibilityOf) {
        elem.style.display = "none";
      }
    }
  } );
}

function add_disable_toggling_event_listeners() {
}

function get_data_from_input_fields() {
  // Need a policy, claim, and organization ID
  const POLICY_ID_VALUE = document.getElementById(POLICY_ID_INPUT_ID).value;
  const CLAIM_ID_VALUE = document.getElementById(CLAIM_ID_INPUT_ID).value;
  if (
    POLICY_ID_VALUE === '' || 
    CLAIM_ID_VALUE === ''
    ) {
    return [];
  }
  
  let facts_to_add = "type(" + CLAIM_ID_VALUE + ", doliabilityclaim)";
  facts_to_add += "type(" + POLICY_ID_VALUE + ", policy) policy.type(" + POLICY_ID_VALUE + ", nia_d_o_liability) ";


  // Get input data from non-subelement fields and fill the corresponding template
  for (const [INPUT_FIELD_ID, FACT_TEMPLATE] of Object.entries(INPUT_FIELD_IDS_TO_FACT_TEMPLATES)) {
    let inputWidget = document.getElementById(INPUT_FIELD_ID);

    if (inputWidget.classList.contains("ignore-input-field")) {
      continue;
    }
    
    let inputValue = getValueFromInputWidget(inputWidget);

    if (inputValue === "") {
      continue;
    }

    // Fill the template
    let filledTemplate = fillTemplate(FACT_TEMPLATE, [
      [/\$POLICY\$/g, POLICY_ID_VALUE],
      [/\$CLAIM\$/g, CLAIM_ID_VALUE],
      [/\$VALUE\$/g, inputValue]
    ]);

    //console.log(filledTemplate);

    facts_to_add += filledTemplate + " ";
  }

  facts_to_add += get_data_from_subelement_tables();
  
  let output = definemorefacts([], readdata(facts_to_add));

  // Calling grindem on an epilog.js dataset or ruleset makes it palatable to read as a human
  //console.log("Output Dataset:\n" + grindem(output));

  return output;
}

function get_data_from_subelement_tables() {
  const POLICY_ID_VALUE = document.getElementById(POLICY_ID_INPUT_ID).value;
  const CLAIM_ID_VALUE = document.getElementById(CLAIM_ID_INPUT_ID).value;

  let facts_to_add = "";

  // ---  Add facts linking the subelements to the claim
  let subelementIDFieldCells = document.getElementsByClassName("subelem-obj-const-input-cell");
  
  for (let i = 0; i < subelementIDFieldCells.length; i++) {
    let subelementIDFieldCell = subelementIDFieldCells[i];
    
    const SUB_ELEM_ID = document.getElementById(subelementIDFieldCell.dataset.subElemObjConstInputID).value;

    let filledTemplate = fillTemplate(subelementIDFieldCell.dataset.factTemplate, [
      [/\$CLAIM\$/g, CLAIM_ID_VALUE],
      [/\$POLICY\$/g, POLICY_ID_VALUE],
      [/\$SUB_ELEM_ID\$/g, SUB_ELEM_ID]
    ]);
    
    facts_to_add += filledTemplate + " ";
  }
  
  // --- Add facts for the subelement-specific rows
  let subelementInputFields = document.getElementsByClassName("subelem-non-obj-const-input-field");

  for (let i = 0; i < subelementInputFields.length; i++) {
    let subelementInputField = subelementInputFields[i];
    let inputValue = getValueFromInputWidget(subelementInputField);

    if (inputValue === "") {
      continue;
    }

    const SUB_ELEM_ID = document.getElementById(subelementIDFieldCell.dataset.subElemObjConstInputID).value;

    let filledTemplate = fillTemplate(subelementInputField.dataset.factTemplate, [
      [/\$CLAIM\$/g, CLAIM_ID_VALUE],
      [/\$POLICY\$/g, POLICY_ID_VALUE],
      [/\$SUB_ELEM_ID\$/g, SUB_ELEM_ID],
      [/\$VALUE\$/g, inputValue],
    ]);
    
    facts_to_add += filledTemplate + " ";
  }

  //console.log(facts_to_add);
  
  return facts_to_add;
}

/*********************** Utility Functions ***********************/

function getValueFromInputWidget(inputWidget) {
  // Get the input type
  let inputType = null;
  if (inputWidget.tagName === "select-one") {
    inputType == "select";
  }
  else {
    inputType = inputWidget.type;
  }

  // Set the value based on the type of the widget
  let inputValue = null;
  if (inputType === "checkbox") {
    inputValue = inputWidget.checked ? "yes" : "no";
  }
  else if (inputType === "date") {
    inputValue = inputWidget.value.replace(/-/g, '_');
  }
  else if (inputType === "time") {
    inputValue = inputWidget.value.replace(/:/g, '_') + "_00";
  }
  else {
    inputValue = inputWidget.value;
  }

  return inputValue;
}

// replacementPairs: list of [regex, string] pairs
function fillTemplate(templateToFill, replacementPairs) {

  for (let [matcher, replacement] of replacementPairs) {
    templateToFill = templateToFill.replace(matcher, replacement);
  }

  return templateToFill;

}

/*********************** BUILDING THE CLAIMS FORM ***********************/

function build_policy_info_section() {
  let rows = [];
  rows.push(newHeadingRow("Policy Information", "policy-info-heading", ["claims-processing-section-heading"]));

  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "text", "policy1", "Policy ID: ", "policy_id_input")], ["policy-info-row"]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "date", "2024-01-01", "Start Date of Policy: ", "policy_startdate_input")], ["policy-info-row"]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "date", "2025-01-01", "End Date of Policy: ", "policy_enddate_input")], ["policy-info-row"]));
  
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "Policy has been canceled: ", "policy_canceled_input")], ["policy-info-row"]));
  rows.push(newClaimsFormSubElementTable("named-members-subelement-table", "Insured Companies (Named Members in Item 1 of Declarations)", "Named Member", "named_member", "entity", "policy.insuree", "$POLICY$", true, [
  ], update_coverage_indicator));

  return rows;
}

function build_claim_info_section() {
  let rows = [];
  
  rows.push(newHeadingRow("Claim Information", "claim-info-heading", ["claims-processing-section-heading"]));
  
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "text", "claim1", "Claim ID: ", "claim_id_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "text", "org1", "Claimant (the entity which this claim was filed by, on behalf of, or with respect to): ", "claimant_id_input")]));
  
  rows.push(newHeadingRow("Claimant Organization Info", "claim-info-subheading", ["claims-processing-section-subheading"]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "text", "org1", "Organization of the Claimant: ", "claimant_org_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "Organization is organized chiefly to provide or fund charitable, religious, educational, scientific, health or human services: ", "org_is_organized_for_charitable_services_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "Organization is a 501(c)(3): ", "org_is_501c3_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "Organization is incorporated, or qualified to do business, in California: ", "org_incorporated_in_california_input")]));
  
  rows.push(newHeadingRow("Additional Claim Info", "claim-info-subheading", ["claims-processing-section-subheading"]));
  rows.push(newClaimsFormInputRow([newClaimsFormSelectCell(2, "organization", "What type of entity is the claimant?", "claimant_type_input", 
    [
        ["organization", "Member - Organization (the Named Member in Item 1 of Declarations of the policy)"],
        ["director", "Member - Director of the Organization"],
        ["trustee", "Member - Trustee of the Organization"],
        ["elected_or_appointed_officer", "Member - Elected or Appointed Officer of the Organization"],
        ["committee_member", "Member - Committee Member of the Organization"],
        ["volunteer", "Member - Volunteer of the Organization"],
        ["spouse_or_domestic_partner_of_member", "Member - Spouse or Domestic Partner of a Director, Trustee, Officer, Committee Member, or Volunteer of the Organization"],
        ["deceased_member", "Member - Deceased"],
        ["estate_heirs_or_legal_rep_of_deceased_member", "Non-member - Estate, heir(s), or legal representative of deceased member"],
        ["existing_subsidiary", "Existing Subsidiary (Subsidiary organization of the Organization, which existed at the time of policy inception)"],
        ["new_subsidiary", "New Subsidiary (Subsidiary organization created or acquired by the Organization since the inception of the policy)"],
        ["successor_org", "Successor in a consolidation or merger that occurred after the inception of the policy"],
        ["other_claimant_type", "Other"]
    ]
    )]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "Claimant voluntarily made a payment, admitted liability for any claim(s), or incurred any 'Defense Costs' without the insuring Company's prior written consent: ", "member_voluntarility_paid_or_admitted_liability_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "Claim is regarding a wrongful act committed by spouse or domestic partner of member: ", "wrongful_act_committed_by_spouse_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "Claim against Member arose solely out of acts taken in their capacity as a Member of the Organization: ", "claim_arose_out_of_acts_taken_solely_in_capacity_as_member_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, `Each Member has cooperated, (i.e. \n 
    <br>i. they promptly sent the insuring Company copies of any demands, notices, summonses and legal papers received in connection with a claim or claims, and
    <br>ii. they authorized the insuring Company to obtain records and other information, and
    <br>iii. they assisted the insuring Company in the enforcement of any right against any person or organization which may be liably to the Member, and
    <br>iv. they attended hearings, trials, and depositions and secured and gave evidence and obtained the attendance of witnesses, as necessary):
    `, "each_member_cooperated_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "Each Member promptly gave notice to the insuring Company if that Member received written or oral notice from any person or entity that it is the intention of such person or entity to hold any Member responsible for a Wrongful Act, OR if that Member became aware of any circumstances which may subsequently give rise to a claim or claims being made against a member for a Wrongful Act: ", "each_member_promptly_gave_notice_regarding_wrongful_act_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "Each Member promptly gave written notice to the insuring Company of any actual or potential claim or claims and has given the insuring Company such information and cooperation as it may reasonably require: ", "each_member_promptly_gave_notice_of_claim_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "All of the representations and statements contained in the application for this policy are true: ", "all_representations_in_application_are_true_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "The responsibility to pay Damages is determined in a suit on the merits which is determined within the United State of America: ", "suits_merits_determined_in_usa_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, `Each member which has rights to recover all or part of any payment or payments made by the insuring Company under this policy from any other person or entity has: 
    <br>i. transferred those rights to the insuring Company, and
    <br>ii. executed all required documents to effect that transfer and has done everything that may be necessary for the insuring Company to secure such rights including the execution of such documents necessary to enable the insuring Company to bring suit in the name of the Member, and
    <br>iii. upon the insuring Company's request, the Member has done all things reasonably necessary to assist the insuring Company in enforcing those rights: `, "transferred_rights_of_payment_recovery_input")]));
  

  rows.push(newHeadingRow("New Subsidiary Info (ignore if claimant type is not 'New Subsidiary (Organization created or...' )", "claim-info-subheading", ["claims-processing-section-subheading"]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "New Subsidiary is a 501(c)(3): ", "new_subsidiary_is_501c3_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "Written notice of the creation or acquisition of the subsidiary has been given to the insuring Company, (and, if it is a 501(c)(3), within 120 days of the creation/acquisition): ", "new_subsidiary_written_notice_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "Any underwriting information required by the insuring Company has been given to them: ", "new_subsidiary_underwriting_info_given_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "Any additional required premium has been provided to the insuring Company: ", "new_subsidiary_additional_premium_given_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "Written approval has been received from the insuring Company: ", "new_subsidiary_written_approval_received_input")]));
  
  rows.push(newHeadingRow("Successor Org Info (ignore if claimant type is not 'Successor in a consolidation...' )", "claim-info-subheading", ["claims-processing-section-subheading"]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "Insuring Company was given written notice, along with any information they required, within 30 days of the merger, consolidation, or acquisition: ", "successor_written_notice_given_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "The Organization paid the Insuring Company any additional premium required as a result of the merger, consolidation, or acquisition: ", "successor_additional_premium_given_input")]));
  
  rows.push(newHeadingRow("Wrongful Act Info", "claim-info-subheading", ["claims-processing-section-subheading"]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "date", "2024-03-14", "Date of Wrongful Act this claim was precipitated by: ", "wrongful_act_date_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "The Wrongful Act was a breach of duty, error, neglect, omission or act: ", "wrongful_act_was_valid_type_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "The wrongful act was committed solely in the course of the activities of the Organization: ", "wrongful_act_committed_solely_in_course_of_activities_of_org_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormSelectCell(2, "personal_injury", "What did the Wrongful Act result in?", "wrongful_act_result_type_input", 
    [
        ["personal_injury", "Personal injury"],
        ["claim_of_harassment_or_discrimination_brought_by_volunteer", "Claim(s) of harassment or discrimination brought by a past or present volunteer of the Organization solely in their capacity as a volunteer"],
        ["claim_of_harassment_or_discrimination_brought_by_third_party_business_invitee", "Claim(s) of harassment or discrimination brought by a third-party business invitee of the Organization solely in their capacity as a business invitee"],
        ["other_nonexcluded_result", "Other Result - Not Excluded "],
        ["other_excluded_result", "Other Result - Excluded"]
    ]
    )]));
  
  rows.push(newHeadingRow("Monetary Damages Info", "claim-info-subheading", ["claims-processing-section-subheading"]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "There has been a demand or judicial or administrative suit or proceeding against the Member, including any appeal therefrom, which seeks monetary Damages: ", "monetary_damages_sought_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", true, "The Damages consist of monetary judgment for compensatory damages and the suit or proceeding seeks compensatory damages: ", "monetary_damages_are_compensatory_damages_input")]));
  rows.push(newClaimsFormInputRow([newClaimsFormInputCell(2, "checkbox", false, "The Damages include solely taxes, severance payments, amounts to reimburse an employee for expenses incurred as a result of employment, equitable or injuctive relief and/or matters uninsurable under the law pursuant to which this policy is construed: ", "monetary_damages_solely_excluded_type_input")]));
  
  return rows;
}






function build_claims_processing_table() {
  let rowList = [...[],
  
  ...build_policy_info_section(),
  ...build_claim_info_section(),
  ...[]];

  addRowsToTableWithID("claims-processing-table", rowList);

  let inputAndSelectElements = document.querySelectorAll('input, select');


  /*let outputStr = "";

  // Loop through the elements and print their IDs
  inputAndSelectElements.forEach(function(element) {
    outputStr += "\"" + element.id + "\": \"\",\n";
  });

  //console.log(outputStr);
  */
}

// Your policy rules go here
let policy_rules = `

covers(Policy, Claim) :-
    policy.type(Policy, nia_d_o_liability) &
    covered_under_policy(Claim, Policy, nia_d_o_liability)

% In the context of D&O, policy.insuree holds of Named Members, which are organizations declared in Item 1 of the Declarations of the policy
covered_under_policy(Claim, Policy, nia_d_o_liability) :-
    claim.claimant_org(Claim, Organization) &
    policy.insuree(Policy, Organization) &
    insurable_event(Claim, Policy) &            % A
    conditions_met(Claim, Policy) &             % B
    ~exclusion_applies(Claim, Policy)           % C (Encoding removed for this demo, per Chris Reed's instruction. Treating this as a base relation for now.)



%%%% A
insurable_event(Claim, Policy) :-
    filed_by_on_behalf_of_or_with_respect_to_valid_entity(Claim, Policy) &  % 1
    regarding_covered_wrongful_act(Claim, Policy) &                         % 3 and 4
    covered_monetary_damages(Claim) &                               % 5, 6, and 7
    request_from_valid_entity(Claim) &                              % 8
    claim.member_voluntarily_made_payment_admitted_liability_or_incurred_defense_costs_without_insuring_company_prior_written_consent(Claim, no) & % 2
    claim.wrongful_act_committed_by_spouse_or_domestic_partner_of_member(Claim, no) % 9

% 1.a
filed_by_on_behalf_of_or_with_respect_to_valid_entity(Claim, Policy) :-
    claim.claimant_type(Claim, organization)

filed_by_on_behalf_of_or_with_respect_to_valid_entity(Claim, Policy) :-
    claim.claimant_type(Claim, ClaimantType) &
    member(ClaimantType, [
        director,
        trustee,
        elected_or_appointed_officer,
        committee_member,
        volunteer,
        spouse_or_domestic_partner_of_member
    ]) &
    claim.claim_against_member_arose_out_of_acts_taken_solely_in_capacity_as_such(Claim, yes)


% 1.b
% claim or wrongful act of a deceased member or a claim against the estate, heirs, or legal representaives of such a Member
filed_by_on_behalf_of_or_with_respect_to_valid_entity(Claim, Policy) :-
    claim.claimant_type(Claim, ClaimantType) &
    member(ClaimantType, [
        deceased_member,
        estate_heirs_or_legal_rep_of_deceased_member
    ])


% 1.c
filed_by_on_behalf_of_or_with_respect_to_valid_entity(Claim, Policy) :-
    claim.claimant_type(Claim, existing_subsidiary) &
    claim.claimant(Claim, Claimant) &
    policy.insuree(Policy, Claimant)


% 1.d
filed_by_on_behalf_of_or_with_respect_to_valid_entity(Claim, Policy) :-
    claim.claimant_type(Claim, new_subsidiary) &
    claim.new_subsidiary_is_501c3(Claim, yes) &
    claim.new_subsidiary_written_notice_given_to_insuring_company(Claim, yes) &
    claim.new_subsidiary_underwriting_info_given_to_insuring_company(Claim, yes) &
    claim.new_subsidiary_additional_premium_given_to_insuring_company(Claim, yes)


% 1.e
filed_by_on_behalf_of_or_with_respect_to_valid_entity(Claim, Policy) :-
    claim.claimant_type(Claim, new_subsidiary) &
    claim.new_subsidiary_is_501c3(Claim, no) &
    claim.new_subsidiary_written_notice_given_to_insuring_company(Claim, yes) &
    claim.new_subsidiary_underwriting_info_given_to_insuring_company(Claim, yes) &
    claim.new_subsidiary_written_approval_received_from_insuring_company(Claim, yes) &
    claim.new_subsidiary_additional_premium_given_to_insuring_company(Claim, yes)


% 1.f
filed_by_on_behalf_of_or_with_respect_to_valid_entity(Claim, Policy) :-
    claim.claimant_type(Claim, successor_org) &
    claim.merger_consolidation_or_acquisition_written_notice_and_information_given_to_insuring_company(Claim, yes) &
    claim.merger_consolidation_or_acquisition_additional_premium_given_to_insuring_company(Claim, yes)



% 3 and 4
    % Subgoals 1-3 are point 3, last two subgoals are point 4
regarding_covered_wrongful_act(Claim, Policy) :-
    claim.resulted_from_breach_of_duty_error_neglect_omission_or_act(Claim, yes) &
    wrongful_act_occurred_during_policy_period(Claim, Policy) &
    claim.wrongful_act_committed_solely_in_course_of_activities_of_org(Claim, yes) &
    claim.wrongful_act_result_type(Claim, ResultType) &
    member(ResultType, [
        personal_injury,
        claim_of_harassment_or_discrimination_brought_by_volunteer,
        claim_of_harassment_or_discrimination_brought_by_third_party_business_invitee,
        other_nonexcluded_result
    ])


    % 3
wrongful_act_occurred_during_policy_period(Claim, Policy) :-
    claim.date_of_wrongful_act(Claim, ActDate) &
    policy.startdate(Policy, SD) &
    policy.enddate(Policy, ED) &
    symleq(SD, ActDate) &
    symleq(ActDate, ED)


% 5, 6, 7
covered_monetary_damages(Claim) :-
    claim.monetary_damages_sought(Claim, yes) & % 5
    claim.monetary_damages_consist_of_judgment_for_compensatory_damages(Claim, yes) & % 6
    claim.monetary_damages_solely_consist_of_taxes_severance_reimbursements_for_expenses_resulting_from_employment_equitable_or_injunctive_relief_and_or_matters_uninsurable(DamagesEvent, no) % 7


% 8
request_from_valid_entity(Claim) :-
    claim.organization_organized_chiefly_to_provide_charitable_religious_educational_scientific_health_or_human_services(Claim, yes) &
    claim.organization_is_501c3_or_corresponding(Claim, yes) &
    claim.organization_incorporated_or_qualified_to_do_business_in_california(Claim, yes)

%%%% B
conditions_met(Claim, Policy) :-
    policy.canceled(Policy, no) & % 10
    claim.each_member_has_cooperated(Claim, yes) & % 11
    claim.each_member_promptly_gave_notice_to_insuring_company_of_claim_for_wrongful_act_committed_during_policy_period(Claim, yes) & % 12
    claim.each_member_promptly_gave_written_notice_to_insuring_company_of_actual_or_potential_claim_and_gave_required_info_and_cooperation(Claim, yes) & % 13
    claim.all_representations_and_statements_in_application_for_policy_are_true(Claim, yes) & % 14
    claim.responsibility_to_pay_damages_determined_in_suit_on_merits_determined_in_usa(Claim, yes) & % 15
    claim.transferred_rights_of_payment_recovery_to_insuring_company(Claim, yes) % 16


`;
