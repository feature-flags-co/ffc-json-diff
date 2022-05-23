import changesets from './index';

var oldObj = {
	"featureFlag": {
		"_Id": "6260014269025b6f65a1c688",
		"id": "FF__5__125__265__user-info-v2",
		"environmentId": 265,
		"isArchived": false,
		"ff": {
			"id": "FF__5__125__265__user-info-v2",
			"name": "user info v2",
			"type": 1,
			"keyName": "user-info-v2",
			"environmentId": 265,
			"creatorUserId": "fa775842-3bcb-48c9-a95f-9ccaa381bc9f",
			"status": "Enabled",
			"isDefaultRulePercentageRolloutsIncludedInExpt": null,
			"lastUpdatedTime": "2022-04-20T14:13:48.914Z",
			"defaultRulePercentageRollouts": [{
				"exptRollout": null,
				"rolloutPercentage": [0, 1],
				"valueOption": {
					"localId": 2,
					"displayOrder": 2,
					"variationValue": "false"
				}
			}],
			"variationOptionWhenDisabled": {
				"localId": 2,
				"displayOrder": 2,
				"variationValue": "false"
			}
		},
		"ffp": [],
		"fftuwmtr": [],
		"targetIndividuals": [{
			"individuals": [],
			"valueOption": {
				"localId": 1,
				"displayOrder": 1,
				"variationValue": "true"
			}
		}, {
			"individuals": [],
			"valueOption": {
				"localId": 2,
				"displayOrder": 2,
				"variationValue": "false"
			}
		}],
		"variationOptions": [{
			"localId": 1,
			"displayOrder": 1,
			"variationValue": "true"
		}, {
			"localId": 2,
			"displayOrder": 2,
			"variationValue": "false"
		}],
		"version": null,
		"effeciveDate": null,
		"exptIncludeAllRules": true
	},
	"tags": []
};


const newObj = {
	"featureFlag": {
		"_Id": "6260014269025b6f65a1c688",
		"id": "FF__5__125__265__user-info-v2",
		"environmentId": 265,
		"isArchived": false,
		"ff": {
			"id": "FF__5__125__265__user-info-v2",
			"name": "user info v2",
			"type": 1,
			"keyName": "user-info-v2",
			"environmentId": 265,
			"creatorUserId": "fa775842-3bcb-48c9-a95f-9ccaa381bc9f",
			"status": "Enabled",
			"isDefaultRulePercentageRolloutsIncludedInExpt": null,
			"lastUpdatedTime": "2022-05-19T06:56:55.709Z",
			"defaultRulePercentageRollouts": [{
				"exptRollout": null,
				"rolloutPercentage": [0, 1],
				"valueOption": {
					"localId": 2,
					"displayOrder": 2,
					"variationValue": "false"
				}
			}],
			"variationOptionWhenDisabled": {
				"localId": 2,
				"displayOrder": 2,
				"variationValue": "false"
			}
		},
		"ffp": [],
		"fftuwmtr": [{
			"ruleId": "4a2f5bc4-4f2c-4e23-9c1a-296bb9ef78c2",
			"ruleName": "规则1",
			"isIncludedInExpt": null,
			"ruleJsonContent": [{
				"property": "Name",
				"operation": "Equal",
				"value": "abc"
			}],
			"valueOptionsVariationRuleValues": [{
				"exptRollout": null,
				"rolloutPercentage": [0, 0.6],
				"valueOption": {
					"localId": 1,
					"displayOrder": 1,
					"variationValue": "true"
				}
			}, {
				"exptRollout": null,
				"rolloutPercentage": [0.6, 1],
				"valueOption": {
					"localId": 2,
					"displayOrder": 2,
					"variationValue": "false"
				}
			}]
		}],
		"targetIndividuals": [{
			"individuals": [{
				"id": "WU__265__e386359b-1591-4ccf-bd39-1cee4018f3b3",
				"name": "e386359b-1591-4ccf-bd39-1cee4018f3b3",
				"keyId": "e386359b-1591-4ccf-bd39-1cee4018f3b3",
				"email": "e386359b-1591-4ccf-bd39-1cee4018f3b3@anonymous.com"
			}],
			"valueOption": {
				"localId": 1,
				"displayOrder": 1,
				"variationValue": "true"
			}
		}, {
			"individuals": [{
				"id": "WU__265__59688fa3-4ed2-4311-8c45-32545b0d5311",
				"name": "59688fa3-4ed2-4311-8c45-32545b0d5311",
				"keyId": "59688fa3-4ed2-4311-8c45-32545b0d5311",
				"email": "59688fa3-4ed2-4311-8c45-32545b0d5311@anonymous.com"
			}],
			"valueOption": {
				"localId": 2,
				"displayOrder": 2,
				"variationValue": "false"
			}
		}],
		"variationOptions": [{
			"localId": 1,
			"displayOrder": 1,
			"variationValue": "true"
		}, {
			"localId": 2,
			"displayOrder": 2,
			"variationValue": "false"
		}],
		"version": null,
		"effeciveDate": null,
		"exptIncludeAllRules": true
	},
	"tags": []
}

const diffs = changesets.diff(oldObj, newObj, {children: 'name'});
console.log(diffs);


