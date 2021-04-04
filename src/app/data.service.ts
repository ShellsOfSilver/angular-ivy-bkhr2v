import { Injectable } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class DataService {
  initFormGroup: FormGroup;
  importanceCriteriaForm: FormGroup;
  importanceCriteriaTable: {
    columns: Array<string>;
    dataSource: any;
  };
  benefitsCostsForm: FormGroup;
  benefitsCostsTable: {
    columns: Array<string>;
    dataSource: any;
  };
  expertMatrixForm: FormGroup;
  expertMatrixTable: Array<{
    columns: Array<string>;
    dataSource: any;
  }>;
  aggregationMatrixCriteriaTable: {
    columns: Array<string>;
    dataSource: any;
  };
  aggregationMatrixAlternativeTable: {
    columns: Array<string>;
    dataSource: any;
  };
  // triangularFuzzyCriteriaTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };
  // triangularFuzzyExpertsTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };
  // matrixFNTransformedLinguisticTermsCriteriaTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };
  // matrixFNTransformedLinguisticTermsExpertsTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };
  // matrixOptimalValueTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };

  // notmalisedFuzzyMatrixTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };

  // normalizedWMatrixTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };

  // overallIntervalValuedFuzzyPerformanceRatingTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };

  // defuzzificationTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };

  // degreeOfUtilityTable: {
  //   columns: Array<string>;
  //   dataSource: any;
  // };

  listOfCriterias: any = [
    { value: "VL", viewValue: "Very low (VL)", trValue: [0.0, 0.1, 0.3] },
    { value: "L", viewValue: "Low (L)", trValue: [0.1, 0.3, 0.5] },
    { value: "M", viewValue: "Medium (M)", trValue: [0.3, 0.5, 0.7] },
    { value: "H", viewValue: "High (H)", trValue: [0.5, 0.7, 0.9] },
    { value: "VH", viewValue: "Very high (VH)", trValue: [0.7, 0.9, 1.0] }
  ];

  listOfExpertAssesments: any = [
    { value: "VP", viewValue: "Very poor (VP)", trValue: [0.0, 0.0, 0.2] },
    { value: "P", viewValue: "Poor (P)", trValue: [0.0, 0.2, 0.4] },
    { value: "F", viewValue: "Fair (F)", trValue: [0.2, 0.4, 0.6] },
    { value: "G", viewValue: "Good (G)", trValue: [0.4, 0.6, 0.8] },
    { value: "VG", viewValue: "Very good (VG)", trValue: [0.6, 0.8, 1.0] },
    { value: "E", viewValue: "Excellent (E)", trValue: [0.8, 0.9, 1.0] }
  ];

  constructor(private _formBuilder: FormBuilder) {}

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  initForm() {
    this.initFormGroup = this._formBuilder.group({
      numberAlternatives: ["", Validators.min(3)],
      numberCriteria: ["", Validators.min(3)],
      numberExperts: ["", Validators.min(3)]
    });
  }

  setInitRandom() {
    this.initFormGroup.setValue({
      numberAlternatives: 8,
      numberCriteria: 6,
      numberExperts: 4
    });
  }

  setImportanceCriteria() {
    this.importanceCriteriaTable = null;
    const form = this._formBuilder.group({});
    const numberCriteria = this.initFormGroup.get("numberCriteria").value;
    const numberExperts = this.initFormGroup.get("numberExperts").value;

    const columns = ["none"];
    const dataSource = [];

    for (let i = 0; i < numberExperts; i++) {
      columns.push(`E${i + 1}`);
    }

    for (let i = 0; i < numberCriteria; i++) {
      const sub = {};

      columns.forEach((e, ix) => {
        if (e === "none") {
          sub[e] = {
            data: `C${i + 1}`,
            start: true,
            id: `${i}_${ix}`
          };
        } else {
          sub[e] = {
            data: i,
            id: `${i}_${ix}`
          };
          form.addControl(`${i}_${ix}`, new FormControl(""));
        }
      });
      dataSource.push(sub);
    }

    this.importanceCriteriaForm = form;
    this.importanceCriteriaTable = {
      columns,
      dataSource
    };
  }

  setImportanceRandom() {
    const res = {};
    const form = this.importanceCriteriaForm.value;
    Object.keys(form).forEach(key => {
      const atl = Object.keys(this.listOfCriterias);
      const inx = this.randomInteger(2, atl.length - 1);
      res[key] = this.listOfCriterias[atl[inx]].value;
    });
    this.importanceCriteriaForm.setValue(res);
  }

  setBenefitsCost() {
    this.benefitsCostsTable = null;
    const form = this._formBuilder.group({});
    const numberCriteria = this.initFormGroup.get("numberCriteria").value;

    const columns = ["none", "Benefit?"];
    const dataSource = [];

    for (let i = 0; i < numberCriteria; i++) {
      const sub = {};

      columns.forEach((e, ix) => {
        if (e === "none") {
          sub[e] = {
            data: `C${i + 1}`,
            start: true,
            id: `${i}_${ix}`
          };
        } else {
          sub[e] = {
            data: i,
            id: `${i}_${ix}`
          };
          form.addControl(`${i}_${ix}`, new FormControl(false));
        }
      });
      dataSource.push(sub);
    }

    this.benefitsCostsTable = {
      columns,
      dataSource
    };

    this.benefitsCostsForm = form;
  }

  setBenefitsCostsRandom() {
    const res = {};
    const form = this.benefitsCostsForm.value;
    Object.keys(form).forEach(key => {
      res[key] = this.randomInteger(1, 2) > 1;
    });
    this.benefitsCostsForm.setValue(res);
  }

  setMatrixRandom() {
    const res = {};
    const form = this.expertMatrixForm.value;
    Object.keys(form).forEach(key => {
      const atl = Object.keys(this.listOfExpertAssesments);
      const inx = this.randomInteger(2, atl.length - 1);
      res[key] = this.listOfExpertAssesments[atl[inx]].value;
    });
    this.expertMatrixForm.setValue(res);
  }

  setExpertMatrix() {
    this.expertMatrixTable = [];
    const form = this._formBuilder.group({});
    const numberCriteria = this.initFormGroup.get("numberCriteria").value;
    const numberExperts = this.initFormGroup.get("numberExperts").value;
    const numberAlternatives = this.initFormGroup.get("numberAlternatives")
      .value;

    for (let inx = 0; inx < numberExperts; inx++) {
      const columns = ["none"];
      const dataSource = [];

      for (let i = 0; i < numberAlternatives; i++) {
        columns.push(`A${i + 1}`);
      }

      for (let i = 0; i < numberCriteria; i++) {
        const sub = {};
        columns.forEach((e, ix) => {
          if (e === "none") {
            sub[e] = {
              data: `C${i + 1}`,
              start: true,
              id: `${inx}_${i}_${ix}`
            };
          } else {
            sub[e] = {
              data: i,
              id: `${inx}_${i}_${ix}`
            };
            form.addControl(`${inx}_${i}_${ix}`, new FormControl(""));
          }
        });
        dataSource.push(sub);
      }

      this.expertMatrixTable.push({
        columns,
        dataSource
      });
    }
    this.expertMatrixForm = form;
  }

  setAggregationMatrix() {
    this.aggregationMatrixCriteriaTable = null;
    this.aggregationMatrixAlternativeTable = null;

    const form = this.importanceCriteriaForm.value;
    const form1 = this.expertMatrixForm.value;
    const numberCriteria = this.initFormGroup.get("numberCriteria").value;
    const numberAlternatives = this.initFormGroup.get("numberAlternatives")
      .value;
    const columns = ["none", "Weight"];
    const columns1 = ["none"];
    let dataSource = [];
    let dataSource1 = [];

    for (let i = 0; i < numberAlternatives; i++) {
      columns1.push("A" + (i + 1));
    }

    for (let i = 0; i < numberCriteria; i++) {
      dataSource.push({
        none: {
          data: `C${i + 1}`,
          start: true,
          id: `${i}`
        },
        Weight: {
          data: [],
          id: `${i}`
        }
      });

      const alr = {};
      for (let j = 0; j < numberAlternatives; j++) {
        alr["A" + (j + 1)] = {
          data: [],
          id: `${i}_${j}`
        };
      }
      dataSource1.push({
        none: {
          data: `C${i + 1}`,
          start: true,
          id: `${i}`
        },
        ...alr
      });
    }

    Object.keys(form).forEach(key => {
      const ids = key.split("_");
      dataSource[+ids[0]].Weight.data = [
        ...dataSource[+ids[0]].Weight.data,
        form[key]
      ];
    });

    dataSource = dataSource.map(el => {
      const l = el.Weight.data;
      const res = [0, 0, 0];
      l.forEach(e => {
        const m = this.listOfCriterias.find(k => k.value === e);
        res[0] += +m.trValue[0];
        res[1] += +m.trValue[1];
        res[2] += +m.trValue[2];
      });
      res[0] = +(res[0] / l.length).toFixed(3);
      res[1] = +(res[1] / l.length).toFixed(3);
      res[2] = +(res[2] / l.length).toFixed(3);
      el.Weight.data = JSON.stringify(res);
      return el;
    });

    this.aggregationMatrixCriteriaTable = {
      columns,
      dataSource
    };

    Object.keys(form1).forEach(key => {
      const ids = key.split("_");
      dataSource1[+ids[1]]["A" + +ids[2]].data = [
        ...dataSource1[+ids[1]]["A" + +ids[2]].data,
        form1[key]
      ];
    });

    dataSource1 = dataSource1.map(el => {
      Object.keys(el).forEach(sK => {
        if (sK !== "none") {
          const l = el[sK].data;
          const res = [0, 0, 0];
          l.forEach(e => {
            const m = this.listOfExpertAssesments.find(k => k.value === e);
            res[0] += +m.trValue[0];
            res[1] += +m.trValue[1];
            res[2] += +m.trValue[2];
          });
          res[0] = +(res[0] / l.length).toFixed(3);
          res[1] = +(res[1] / l.length).toFixed(3);
          res[2] = +(res[2] / l.length).toFixed(3);
          el[sK].data = JSON.stringify(res);
        }
      });

      return el;
    });

    this.aggregationMatrixAlternativeTable = {
      columns: columns1,
      dataSource: dataSource1
    };
  }

  // setTriangularFuzzyNumbers() {
  //   this.triangularFuzzyExpertsTable = null;
  //   this.triangularFuzzyCriteriaTable = null;
  //   const form = this.importanceCriteriaForm.value;

  //   this.triangularFuzzyExpertsTable = {
  //     columns: [...this.aggregationMatrixTable.columns],
  //     dataSource: JSON.parse(
  //       JSON.stringify(this.aggregationMatrixTable.dataSource)
  //     ).map(res => {
  //       Object.keys(res).forEach(key => {
  //         const val = res[key];

  //         if (val.data.startsWith("[")) {
  //           val.data = JSON.stringify(
  //             JSON.parse(val.data).map(e => {
  //               return this.listOfExpertAssesments.find(k => k.value === e)
  //                 .trValue;
  //             })
  //           );
  //         } else {
  //           val.data = val.data.replace("E", "A");
  //         }
  //       });
  //       return res;
  //     })
  //   };

  //   this.triangularFuzzyCriteriaTable = {
  //     columns: [...this.importanceCriteriaTable.columns],
  //     dataSource: JSON.parse(
  //       JSON.stringify(this.importanceCriteriaTable.dataSource)
  //     ).map(res => {
  //       Object.keys(res).forEach(key => {
  //         const val = res[key];
  //         if (!`${val.data}`.startsWith("E")) {
  //           val.data = JSON.stringify(
  //             this.listOfCriterias.find(e => e.value === form[val.id]).trValue
  //           );
  //         }
  //       });
  //       return res;
  //     })
  //   };
  // }

  // setFuzzyNumbersTransformedLinguisticTerms() {
  //   this.matrixFNTransformedLinguisticTermsCriteriaTable = null;
  //   const dataSource = [];
  //   const critList = {};
  //   const sourceC = this.triangularFuzzyCriteriaTable.dataSource;
  //   const sourceE = this.triangularFuzzyExpertsTable.dataSource;

  //   sourceC.forEach(el => {
  // Object.keys(el).forEach(sK => {
  //   if (sK !== "none") {
  //     const key = `${el["none"].data}`.replace("E", "C");
  //     const ids = `${el[sK].id}`.split("_");
  //     if (!critList["C" + ids[1]]) {
  //       critList["C" + ids[1]] = {};
  //     }
  //     critList["C" + ids[1]][key] = el[sK].data;
  //   }
  // });
  //   });

  //   for (let i = 0; i < Object.keys(sourceC[0]).length - 1; i++) {
  //     const res = {};
  //     res["none"] = {
  //       id: i,
  //       start: true,
  //       data: "C" + (1 + i)
  //     };

  //     res["l"] = {
  //       id: i,
  //       data: Math.min(
  //         ...Object.values(critList["C" + (1 + i)]).map(
  //           (pp: string) => JSON.parse(pp)[0]
  //         )
  //       )
  //     };

  //     res["l`"] = {
  //       id: i,
  //       data: Math.pow(
  //         Object.values(critList["C" + (1 + i)])
  //           .map((pp: string) => JSON.parse(pp)[0])
  //           .reduce((a, b) => a * b, 1),
  //         1 / Object.values(critList["C" + (1 + i)]).length
  //       )
  //     };

  //     res["m"] = {
  //       id: i,
  //       data: Math.pow(
  //         Object.values(critList["C" + (1 + i)])
  //           .map((pp: string) => JSON.parse(pp)[1])
  //           .reduce((a, b) => a * b, 1),
  //         1 / Object.values(critList["C" + (1 + i)]).length
  //       )
  //     };

  //     res["u`"] = {
  //       id: i,
  //       data: Math.pow(
  //         Object.values(critList["C" + (1 + i)])
  //           .map((pp: string) => JSON.parse(pp)[2])
  //           .reduce((a, b) => a * b, 1),
  //         1 / Object.values(critList["C" + (1 + i)]).length
  //       )
  //     };

  //     res["u"] = {
  //       id: i,
  //       data: Math.max(
  //         ...Object.values(critList["C" + (1 + i)]).map(
  //           (pp: string) => JSON.parse(pp)[2]
  //         )
  //       )
  //     };

  //     dataSource.push(res);
  //   }

  //   this.matrixFNTransformedLinguisticTermsCriteriaTable = {
  //     columns: ["none", "l", "l`", "m", "u`", "u"],
  //     dataSource
  //   };

  //   const dataSourceExp = [];

  //   for (let j = 0; j < Object.keys(sourceE).length; j++) {
  //     for (let i = 0; i < Object.keys(sourceE[j]).length - 1; i++) {
  //       const res = {};
  //       res["none"] = {
  //         id: i,
  //         start: true,
  //         data: `A${1 + j}_C${1 + i}`
  //       };
  //       res["l"] = {
  //         id: i,
  //         data: Math.min(
  //           ...JSON.parse(sourceE[j][`C${1 + i}`].data).map(e => e[0])
  //         )
  //       };

  //       res["l`"] = {
  //         id: i,
  //         data: Math.pow(
  //           JSON.parse(sourceE[j][`C${1 + i}`].data)
  //             .map(e => e[0])
  //             .reduce((a, b) => a * b, 1),
  //           1 / JSON.parse(sourceE[j][`C${1 + i}`].data).length
  //         )
  //       };

  //       res["m"] = {
  //         id: i,
  //         data: Math.pow(
  //           JSON.parse(sourceE[j][`C${1 + i}`].data)
  //             .map(e => e[1])
  //             .reduce((a, b) => a * b, 1),
  //           1 / JSON.parse(sourceE[j][`C${1 + i}`].data).length
  //         )
  //       };

  //       res["u`"] = {
  //         id: i,
  //         data: Math.pow(
  //           JSON.parse(sourceE[j][`C${1 + i}`].data)
  //             .map(e => e[2])
  //             .reduce((a, b) => a * b, 1),
  //           1 / JSON.parse(sourceE[j][`C${1 + i}`].data).length
  //         )
  //       };

  //       res["u"] = {
  //         id: i,
  //         data: Math.max(
  //           ...JSON.parse(sourceE[j][`C${1 + i}`].data).map(e => e[2])
  //         )
  //       };

  //       dataSourceExp.push(res);
  //     }
  //   }

  //   this.matrixFNTransformedLinguisticTermsExpertsTable = {
  //     columns: ["none", "l", "l`", "m", "u`", "u"],
  //     dataSource: dataSourceExp
  //   };
  // }

  // setMatrixOptimalValuesCriteria() {
  //   this.matrixOptimalValueTable = null;
  //   const dataSource = [];
  //   const listCr = {};

  //   this.matrixFNTransformedLinguisticTermsExpertsTable.dataSource.forEach(
  //     el => {
  //       Object.keys(el).forEach(key => {
  //         if (key !== "none") {
  //           const keys = `${el["none"].data}`.split("_");
  //           if (!listCr[keys[1]]) {
  //             listCr[keys[1]] = {};
  //           }
  //           listCr[keys[1]][keys[0]] = el;
  //         }
  //       });
  //     }
  //   );

  //   Object.keys(listCr).forEach(key => {
  //     const res = {};
  //     res["none"] = {
  //       id: 0,
  //       start: true,
  //       data: key
  //     };

  //     res["l"] = {
  //       id: 0,
  //       data: Math.max(...Object.values(listCr[key]).map(e => e["l"].data))
  //     };

  //     res["l`"] = {
  //       id: 0,
  //       data: Math.max(...Object.values(listCr[key]).map(e => e["l`"].data))
  //     };

  //     res["m"] = {
  //       id: 0,
  //       data: Math.max(...Object.values(listCr[key]).map(e => e["m"].data))
  //     };

  //     res["u`"] = {
  //       id: 0,
  //       data: Math.max(...Object.values(listCr[key]).map(e => e["u`"].data))
  //     };

  //     res["u"] = {
  //       id: 0,
  //       data: Math.max(...Object.values(listCr[key]).map(e => e["u"].data))
  //     };

  //     dataSource.push(res);
  //   });

  //   this.matrixOptimalValueTable = {
  //     columns: ["none", "l", "l`", "m", "u`", "u"],
  //     dataSource
  //   };
  // }

  // setNotmalisedFuzzyMatrix() {
  //   this.notmalisedFuzzyMatrixTable = null;
  //   const dataSource = [];

  //   const exp = JSON.parse(
  //     JSON.stringify(
  //       this.matrixFNTransformedLinguisticTermsExpertsTable.dataSource
  //     )
  //   );
  //   const opt = JSON.parse(
  //     JSON.stringify(this.matrixOptimalValueTable.dataSource)
  //   );
  //   const col = opt.length;

  //   const criterias = {};
  //   exp.forEach(el => {
  //     const keys = `${el["none"].data}`.split("_");
  //     if (!criterias[keys[1]]) {
  //       criterias[keys[1]] = {};
  //       criterias[keys[1]]["Optimal"] = opt.find(
  //         e => e["none"].data === keys[1]
  //       );
  //     }
  //     criterias[keys[1]][keys[0]] = el;
  //   });

  //   Object.keys(criterias).forEach(key => {
  //     Object.keys(criterias[key]).forEach(sKye => {
  //       const k = key + "_" + sKye;
  //       const d = criterias[key][sKye];
  //       d["none"].data = k;
  //       Object.keys(d).forEach(k => {
  //         if (k !== "none") {
  //           d[k].data = d[k].data / col;
  //         }
  //       });
  //       dataSource.push(d);
  //     });
  //   });

  //   this.notmalisedFuzzyMatrixTable = {
  //     columns: ["none", "l", "l`", "m", "u`", "u"],
  //     dataSource
  //   };
  // }

  // setNormalizedWMatrix() {
  //   this.normalizedWMatrixTable = null;
  //   const norm = JSON.parse(
  //     JSON.stringify(this.notmalisedFuzzyMatrixTable.dataSource)
  //   );
  //   const criter = JSON.parse(
  //     JSON.stringify(
  //       this.matrixFNTransformedLinguisticTermsCriteriaTable.dataSource
  //     )
  //   );
  //   const dataSource = [];

  //   norm.forEach(el => {
  //     const keys = `${el["none"].data}`.split("_");
  //     const cr = criter.find(e => e["none"].data === keys[0]);

  //     Object.keys(el).forEach(k => {
  //       if (k !== "none") {
  //         el[k].data = el[k].data * cr[k].data;
  //       }
  //     });
  //     dataSource.push(el);
  //   });

  //   this.normalizedWMatrixTable = {
  //     columns: ["none", "l", "l`", "m", "u`", "u"],
  //     dataSource
  //   };
  // }

  // setoOerallIntervalValuedFuzzyPerformanceRating() {
  //   this.overallIntervalValuedFuzzyPerformanceRatingTable = null;

  //   const dataSource = [];
  //   const sep = {};

  //   JSON.parse(JSON.stringify(this.normalizedWMatrixTable.dataSource)).forEach(
  //     el => {
  //       const keys = el["none"].data.split("_");

  //       if (!sep[keys[1]]) {
  //         sep[keys[1]] = {};
  //         sep[keys[1]].data = [];
  //       }
  //       sep[keys[1]].data.push(el);
  //     }
  //   );

  //   const getSumEl = (dataList, key) => {
  //     let sum = 0;

  //     dataList.forEach(el => {
  //       sum += el[key].data;
  //     });

  //     return sum;
  //   };

  //   Object.keys(sep).forEach(key => {
  //     const res = {};
  //     res["none"] = {
  //       data: key,
  //       start: true,
  //       id: 0
  //     };

  //     res["l"] = {
  //       data: getSumEl(sep[key].data, "l"),
  //       id: 0
  //     };

  //     res["l`"] = {
  //       data: getSumEl(sep[key].data, "l`"),
  //       id: 0
  //     };

  //     res["m"] = {
  //       data: getSumEl(sep[key].data, "m"),
  //       id: 0
  //     };

  //     res["u`"] = {
  //       data: getSumEl(sep[key].data, "u`"),
  //       id: 0
  //     };

  //     res["u"] = {
  //       data: getSumEl(sep[key].data, "u"),
  //       id: 0
  //     };

  //     dataSource.push(res);
  //   });

  //   this.overallIntervalValuedFuzzyPerformanceRatingTable = {
  //     columns: ["none", "l", "l`", "m", "u`", "u"],
  //     dataSource
  //   };
  // }

  // setDefuzzification() {
  //   this.defuzzificationTable = null;

  //   const dataSource = [];

  //   JSON.parse(
  //     JSON.stringify(
  //       this.overallIntervalValuedFuzzyPerformanceRatingTable.dataSource
  //     )
  //   ).forEach(el => {
  //     const res = {};

  //     res["none"] = el["none"];
  //     res["res"] = {
  //       data:
  //         (el["l"].data +
  //           el["l`"].data +
  //           el["m"].data +
  //           el["u`"].data +
  //           el["u"].data) /
  //         5,
  //       id: 0
  //     };

  //     dataSource.push(res);
  //   });

  //   this.defuzzificationTable = {
  //     columns: ["none", "res"],
  //     dataSource
  //   };
  // }

  // setDegreeOfUtility() {
  //   this.degreeOfUtilityTable = null;
  //   const dataSource = [];

  //   let max = {
  //     none: { data: "" },
  //     res: { data: 0 }
  //   };
  //   const optimal = this.defuzzificationTable.dataSource.find(
  //     e => e["none"].data === "Optimal"
  //   ).res.data;

  //   JSON.parse(JSON.stringify(this.defuzzificationTable.dataSource)).forEach(
  //     el => {
  //       el["res"].data = el["res"].data / +optimal;
  //       if (el["none"].data !== "Optimal" && max.res.data < el["res"].data) {
  //         max = el;
  //       }
  //       dataSource.push(el);
  //     }
  //   );

  //   dataSource.push({
  //     none: {
  //       data: "Solution: " + max.none.data,
  //       id: 0
  //     },
  //     res: {
  //       data:
  //         max.res.data +
  //         " - has a rank of 1, at it is the closest to the optimal solution"
  //     }
  //   });

  //   this.degreeOfUtilityTable = {
  //     columns: ["none", "res"],
  //     dataSource
  //   };
  // }
}
