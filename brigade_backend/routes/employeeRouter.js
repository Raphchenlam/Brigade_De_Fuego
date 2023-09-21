const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD POUR CREATION EMPLOYEE
const crypto = require('crypto');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

const employeeQueries = require('../queries/employeeQueries');

router.get('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const employee = req.user;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));

        employeeQueries.selectAllEmployees().then(employees => {
            res.json(employees);
        }).catch(err => {
            return next(err);
        });
    });


router.get('/role/:role',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const employee = req.user;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));
        const role = req.params.role;

        employeeQueries.selectAllEmployeesByRole(role).then(employeeList => {
            res.json(employeeList);
        }).catch(err => {
            return next(err);
        });
    });

router.get('/role',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const employee = req.user;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));

        employeeQueries.selectAllRoles().then(roleList => {
            console.log("roleList:", roleList);
            res.json(roleList);
        }).catch(err => {
            return next(err);
        });
    });

router.get('/:employeeNumber',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const employee = req.user;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));

        const employeeNumberToGet = req.params.employeeNumber;
        if (employee.employeeNumber != employeeNumberToGet && !employee.isAdmin) return next(new HttpError(403, "Vous ne pouvez pas acceder aux informations d'un autre employé"));

        if (isNaN(employeeNumberToGet)) { return next(new HttpError(404, `Le numero d'employé doit contenir seulement des chiffres`)); }
        if (employeeNumberToGet.length == 4) {
            employeeQueries.selectEmployeeByEmployeeNumber(employeeNumberToGet).then(employee => {
                if (employee) {
                    res.json(employee);
                } else {
                    return next(new HttpError(404, `Employé avec le numéro ${employeeNumberToGet} inexistant ou introuvable`));
                }
            }).catch(err => {
                return next(err);

            });
        } else {
            return next(new HttpError(404, `Numéro non conforme`));
        }
    });

router.get('/barcode/:barcodenumber',
    (req, res, next) => {
        const barcodeNumberToGet = req.params.barcodenumber;

        if (isNaN(barcodeNumberToGet)) { return next(new HttpError(404, `Le Barcode doit contenir seulement des chiffres`)); }
        if (barcodeNumberToGet.length == 16) {
            employeeQueries.selectEmployeeByBarcodeNumber(barcodeNumberToGet).then(employee => {
                if (employee) {
                    res.json(employee);
                } else {
                    return next(new HttpError(404, `Barcode ${barcodeNumberToGet} inexistant ou introuvable`));
                }
            }).catch(err => {
                return next(err);
            });
        } else {
            return next(new HttpError(404, `Numero non conforme`));
        }
    });

router.post('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        console.log("REQ.EMPLOYEE", req.user);

        const employee = req.user;

        if (!employee || !employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));

        let employeeNumber = req.body.employeeNumber;
        if (!employeeNumber || employeeNumber == '') return next(new HttpError(400, 'Le champ employeeNumber est requis'));
        if (!regex.validEmployeeNumber.test(employeeNumber)) return next(new HttpError(400, 'Le numéro d\'employé ne respecte pas les critères d\'acceptation'));

        const firstName = req.body.firstName;
        if (!firstName || firstName == '') return next(new HttpError(400, 'Le champ firstName est requis'));
        if (firstName.length >= 256) return next(new HttpError(400, 'Le champ firstName ne peut pas être composé de plus de 255 caractères'));
        if (!regex.validName.test(firstName)) return next(new HttpError(400, 'Le prénom ne respecte pas les critères d\'acceptation'));

        const lastName = req.body.lastName;
        if (!lastName || lastName == '') return next(new HttpError(400, 'Le champ lastName est requis'));
        if (lastName.length >= 256) return next(new HttpError(400, 'Le champ lastName ne peut pas être composé de plus de 255 caractères'));
        if (!regex.validName.test(lastName)) return next(new HttpError(400, 'Le nom ne respecte pas les critères d\'acceptation'));

        const role = req.body.role;
        if (!role || role == '') return next(new HttpError(400, 'Le champ role est requis'));
        if (!regex.validRole.test(role)) return next(new HttpError(400, 'Le rôle ne respecte pas les critères d\'acceptation'));

        const colorHexCode = req.body.colorHexCode;
        if (!colorHexCode || colorHexCode == '') return next(new HttpError(400, 'Le champ colorHexCode est requis'));
        if (!regex.validColorHexCode.test(colorHexCode)) return next(new HttpError(400, 'Le champ colorHexCode ne respecte pas les critères d\'acceptation'));
        if (colorHexCode == "#827717") return next(new HttpError(400, 'La couleur par défaut (#827717) n\'a pas été changée lors de la création de l\'employé(e)'));

        let hourlyRate = req.body.hourlyRate;
        if (!hourlyRate || hourlyRate == '') return next(new HttpError(400, 'Le champ hourlyRate est requis'));
        if (!regex.validHourlyRate.test(hourlyRate)) return next(new HttpError(400, 'Le champ hourlyRate ne respecte pas les critères d\'acceptation'));
        hourlyRate = parseFloat(hourlyRate);

        const barcodeNumber = req.body.barcodeNumber;
        if (!barcodeNumber || barcodeNumber == '') return next(new HttpError(400, 'Le champ barcodeNumber est requis'));
        if (!regex.validBarcodeNumber.test(barcodeNumber)) return next(new HttpError(400, 'Le champ barcodeNumber ne respecte pas les critères d\'acceptation'));

        const email = req.body.email;
        if (!email || email == '') return next(new HttpError(400, 'Le champ email est requis'));
        if (!regex.validEmail.test(email)) return next(new HttpError(400, 'Le champ email ne respecte pas les critères d\'acceptation'));

        const phoneNumber = req.body.phoneNumber;
        if (!phoneNumber || phoneNumber == '') return next(new HttpError(400, 'Le champ phoneNumber est requis'));

        if (!regex.validPhoneNumber.test(phoneNumber)) return next(new HttpError(400, 'Le champ phoneNumber ne respecte pas les critères d\'acceptation'));

        const isAdmin = req.body.isAdmin;

        let skillPoints = req.body.skillPoints;
        if (role != "Gestionnaire") {
            if (!skillPoints || skillPoints == '') return next(new HttpError(400, 'Le champ skillPoints est requis'));
            if (!regex.validSkillPoints.test(skillPoints)) return next(new HttpError(400, 'Le champ skillPoints ne respecte pas les critères d\'acceptation'));
            skillPoints = parseInt(skillPoints);
        }

        employeeQueries.selectEmployeeByEmployeeNumber(employeeNumber).then(employee => {
            if (employee) throw new HttpError(400, `${employee.firstName} ${employee.lastName} est associé(e) à ce numéro d'employé`);
        },
            employeeNumber = parseInt(employeeNumber)
        ).catch(err => {
            next(err)
        });

        employeeQueries.selectRoleByName(role).then(existingRole => {
            if (!existingRole) throw new HttpError(400, `Le role ${role} n'existe pas`);
        }).catch(err => {
            next(err);
        });;

        employeeQueries.selectAssignedColorHexcode(colorHexCode).then(assignedColorHexcode => {
            if (assignedColorHexcode) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à cette couleur`);
        }).catch(err => {
            next(err);
        });

        employeeQueries.selectEmployeeByBarcodeNumber(barcodeNumber).then(assignedBarcodeNumber => {
            if (assignedBarcodeNumber) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à ce numéro de la carte)`);
        }).catch(err => {
            next(err);
        });;

        employeeQueries.selectUsedEmail(email).then(usedEmail => {
            if (usedEmail) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à cette adresse courriel)`);
        }).catch(err => {
            next(err);
        });

        employeeQueries.selectUsedPhoneNumber(phoneNumber).then(usedPhoneNumber => {
            if (usedPhoneNumber) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à ce numéro de téléphone)`);
        }).catch(err => {
            next(err);
        });

        const newEmployee = {
            employeeNumber: employeeNumber,
            firstName: "" + firstName,
            lastName: "" + lastName,
            role: "" + role,
            colorHexCode: "" + colorHexCode,
            hourlyRate: hourlyRate,
            barcodeNumber: "" + barcodeNumber,
            email: "" + email,
            phoneNumber: "" + phoneNumber,
            isAdmin: isAdmin,
            skillPoints: skillPoints,
        };

        const password = req.body.password;
        if (!password || password == '') return next(new HttpError(400, 'Le champ password est requis'));

        const saltBuf = crypto.randomBytes(16);
        const passwordSalt = saltBuf.toString("base64");

        crypto.pbkdf2(password, passwordSalt, 100000, 64, "sha512", async (err, derivedKey) => {
            if (err) return next(err);

            const passwordHashBase64 = derivedKey.toString("base64");

            try {
                const employeeAccountWithPasswordHash = await employeeQueries.insertEmployee(newEmployee, passwordSalt, passwordHashBase64);
                res.json(employeeAccountWithPasswordHash);
            } catch (err) {
                return next(err);
            }
        });
    });


//put pour Employe ('/:employeeNumber}')   INCOMPLETE
// router.put('/:employeeNumber',
//     passport.authenticate('basic', { session: false }),
//     (req, res, next) => {
//         console.log("REQ.EMPLOYEE", req.user);

//         const employee = req.user;

//         if (!employee || !employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));

//         let employeeNumber = req.body.employeeNumber;
//         if (!employeeNumber || employeeNumber == '') return next(new HttpError(400, 'Le champ employeeNumber est requis'));
//         if (!regex.validEmployeeNumber.test(employeeNumber)) return next(new HttpError(400, 'Le numéro d\'employé ne respecte pas les critères d\'acceptation'));

//         const firstName = req.body.firstName;
//         if (!firstName || firstName == '') return next(new HttpError(400, 'Le champ firstName est requis'));
//         if (firstName.length >= 256) return next(new HttpError(400, 'Le champ firstName ne peut pas être composé de plus de 255 caractères'));
//         if (!regex.validName.test(firstName)) return next(new HttpError(400, 'Le prénom ne respecte pas les critères d\'acceptation'));

//         const lastName = req.body.lastName;
//         if (!lastName || lastName == '') return next(new HttpError(400, 'Le champ lastName est requis'));
//         if (lastName.length >= 256) return next(new HttpError(400, 'Le champ lastName ne peut pas être composé de plus de 255 caractères'));
//         if (!regex.validName.test(lastName)) return next(new HttpError(400, 'Le nom ne respecte pas les critères d\'acceptation'));

//         const role = req.body.role;
//         if (!role || role == '') return next(new HttpError(400, 'Le champ role est requis'));
//         if (!regex.validRole.test(role)) return next(new HttpError(400, 'Le rôle ne respecte pas les critères d\'acceptation'));

//         const colorHexCode = req.body.colorHexCode;
//         if (!colorHexCode || colorHexCode == '') return next(new HttpError(400, 'Le champ colorHexCode est requis'));
//         if (!regex.validColorHexCode.test(colorHexCode)) return next(new HttpError(400, 'Le champ colorHexCode ne respecte pas les critères d\'acceptation'));
//         if (colorHexCode == employee.colorHexCode) return next(new HttpError(400, 'La couleur ne peut pas être changée lors de la modification de l\'employé(e)'));

//         let hourlyRate = req.body.hourlyRate;
//         if (!hourlyRate || hourlyRate == '') return next(new HttpError(400, 'Le champ hourlyRate est requis'));
//         if (!regex.validHourlyRate.test(hourlyRate)) return next(new HttpError(400, 'Le champ hourlyRate ne respecte pas les critères d\'acceptation'));
//         hourlyRate = parseFloat(hourlyRate);

//         const barcodeNumber = req.body.barcodeNumber;
//         if (!barcodeNumber || barcodeNumber == '') return next(new HttpError(400, 'Le champ barcodeNumber est requis'));
//         if (!regex.validBarcodeNumber.test(barcodeNumber)) return next(new HttpError(400, 'Le champ barcodeNumber ne respecte pas les critères d\'acceptation'));

//         const email = req.body.email;
//         if (!email || email == '') return next(new HttpError(400, 'Le champ email est requis'));
//         if (!regex.validEmail.test(email)) return next(new HttpError(400, 'Le champ email ne respecte pas les critères d\'acceptation'));

//         const phoneNumber = req.body.phoneNumber;
//         if (!phoneNumber || phoneNumber == '') return next(new HttpError(400, 'Le champ phoneNumber est requis'));

//         if (!regex.validPhoneNumber.test(phoneNumber)) return next(new HttpError(400, 'Le champ phoneNumber ne respecte pas les critères d\'acceptation'));

//         const isAdmin = req.body.isAdmin;

//         let skillPoints = req.body.skillPoints;
//         if (role != "Gestionnaire") {
//             if (!skillPoints || skillPoints == '') return next(new HttpError(400, 'Le champ skillPoints est requis'));
//             if (!regex.validSkillPoints.test(skillPoints)) return next(new HttpError(400, 'Le champ skillPoints ne respecte pas les critères d\'acceptation'));
//             skillPoints = parseInt(skillPoints);
//         }

//         employeeQueries.selectEmployeeByEmployeeNumber(employeeNumber).then(employee => {
//             if (employee) throw new HttpError(400, `${employee.firstName} ${employee.lastName} est associé(e) à ce numéro d'employé`);
//         },
//             employeeNumber = parseInt(employeeNumber)
//         ).catch(err => {
//             next(err)
//         });

//         employeeQueries.selectRoleByName(role).then(existingRole => {
//             if (!existingRole) throw new HttpError(400, `Le role ${role} n'existe pas`);
//         }).catch(err => {
//             next(err);
//         });;

//         employeeQueries.selectAssignedColorHexcode(colorHexCode).then(assignedColorHexcode => {
//             if (assignedColorHexcode) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à cette couleur`);
//         }).catch(err => {
//             next(err);
//         });

//         employeeQueries.selectEmployeeByBarcodeNumber(barcodeNumber).then(assignedBarcodeNumber => {
//             if (assignedBarcodeNumber) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à ce numéro de la carte)`);
//         }).catch(err => {
//             next(err);
//         });;

//         employeeQueries.selectUsedEmail(email).then(usedEmail => {
//             if (usedEmail) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à cette adresse courriel)`);
//         }).catch(err => {
//             next(err);
//         });

//         employeeQueries.selectUsedPhoneNumber(phoneNumber).then(usedPhoneNumber => {
//             if (usedPhoneNumber) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à ce numéro de téléphone)`);
//         }).catch(err => {
//             next(err);
//         });

//         const updatingEmployee = {
//             employeeNumber: employeeNumber,
//             firstName: "" + firstName,
//             lastName: "" + lastName,
//             role: "" + role,
//             colorHexCode: "" + colorHexCode,
//             hourlyRate: hourlyRate,
//             barcodeNumber: "" + barcodeNumber,
//             email: "" + email,
//             phoneNumber: "" + phoneNumber,
//             isAdmin: isAdmin,
//             skillPoints: skillPoints,
//         };
//
//          CRYPTOGRAPHIE
//
//         try {
//             const updatedEmployee = employeeQueries.updateEmployeeByAdmin(updatingEmployee);
//             res.json(updatedEmployee);
//         } catch (err) {
//             return next(err);
//         }
//     });


//put pour Admin

router.put('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        console.log("REQ.EMPLOYEE", req.user);

        const employee = req.user;

        if (!employee || !employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));

        let employeeNumber = req.body.employeeNumber;
        if (!employeeNumber || employeeNumber == '') return next(new HttpError(400, 'Le champ employeeNumber est requis'));
        if (!regex.validEmployeeNumber.test(employeeNumber)) return next(new HttpError(400, 'Le numéro d\'employé ne respecte pas les critères d\'acceptation'));

        const firstName = req.body.firstName;
        if (!firstName || firstName == '') return next(new HttpError(400, 'Le champ firstName est requis'));
        if (firstName.length >= 256) return next(new HttpError(400, 'Le champ firstName ne peut pas être composé de plus de 255 caractères'));
        if (!regex.validName.test(firstName)) return next(new HttpError(400, 'Le prénom ne respecte pas les critères d\'acceptation'));

        const lastName = req.body.lastName;
        if (!lastName || lastName == '') return next(new HttpError(400, 'Le champ lastName est requis'));
        if (lastName.length >= 256) return next(new HttpError(400, 'Le champ lastName ne peut pas être composé de plus de 255 caractères'));
        if (!regex.validName.test(lastName)) return next(new HttpError(400, 'Le nom ne respecte pas les critères d\'acceptation'));

        const role = req.body.role;
        if (!role || role == '') return next(new HttpError(400, 'Le champ role est requis'));
        if (!regex.validRole.test(role)) return next(new HttpError(400, 'Le rôle ne respecte pas les critères d\'acceptation'));

        const colorHexCode = req.body.colorHexCode;
        if (!colorHexCode || colorHexCode == '') return next(new HttpError(400, 'Le champ colorHexCode est requis'));
        if (!regex.validColorHexCode.test(colorHexCode)) return next(new HttpError(400, 'Le champ colorHexCode ne respecte pas les critères d\'acceptation'));
        if (colorHexCode == employee.colorHexCode) return next(new HttpError(400, 'La couleur ne peut pas être changée lors de la modification de l\'employé(e)'));

        let hourlyRate = req.body.hourlyRate;
        if (!hourlyRate || hourlyRate == '') return next(new HttpError(400, 'Le champ hourlyRate est requis'));
        if (!regex.validHourlyRate.test(hourlyRate)) return next(new HttpError(400, 'Le champ hourlyRate ne respecte pas les critères d\'acceptation'));
        hourlyRate = parseFloat(hourlyRate);

        const barcodeNumber = req.body.barcodeNumber;
        if (!barcodeNumber || barcodeNumber == '') return next(new HttpError(400, 'Le champ barcodeNumber est requis'));
        if (!regex.validBarcodeNumber.test(barcodeNumber)) return next(new HttpError(400, 'Le champ barcodeNumber ne respecte pas les critères d\'acceptation'));

        const email = req.body.email;
        if (!email || email == '') return next(new HttpError(400, 'Le champ email est requis'));
        if (!regex.validEmail.test(email)) return next(new HttpError(400, 'Le champ email ne respecte pas les critères d\'acceptation'));

        const phoneNumber = req.body.phoneNumber;
        if (!phoneNumber || phoneNumber == '') return next(new HttpError(400, 'Le champ phoneNumber est requis'));

        if (!regex.validPhoneNumber.test(phoneNumber)) return next(new HttpError(400, 'Le champ phoneNumber ne respecte pas les critères d\'acceptation'));

        const isAdmin = req.body.isAdmin;

        let skillPoints = req.body.skillPoints;
        if (role != "Gestionnaire") {
            if (!skillPoints || skillPoints == '') return next(new HttpError(400, 'Le champ skillPoints est requis'));
            if (!regex.validSkillPoints.test(skillPoints)) return next(new HttpError(400, 'Le champ skillPoints ne respecte pas les critères d\'acceptation'));
            skillPoints = parseInt(skillPoints);
        }

        employeeQueries.selectEmployeeByEmployeeNumber(employeeNumber).then(employee => {
            if (employee) throw new HttpError(400, `${employee.firstName} ${employee.lastName} est associé(e) à ce numéro d'employé`);
        },
            employeeNumber = parseInt(employeeNumber)
        ).catch(err => {
            next(err)
        });

        employeeQueries.selectRoleByName(role).then(existingRole => {
            if (!existingRole) throw new HttpError(400, `Le role ${role} n'existe pas`);
        }).catch(err => {
            next(err);
        });

        if (email != employee.email) {
            employeeQueries.selectUsedEmail(email).then(usedEmail => {
                if (usedEmail) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à cette adresse courriel)`);
            }).catch(err => {
                next(err);
            });
        }

        if(phoneNumber != employee.phoneNumber)
        employeeQueries.selectUsedPhoneNumber(phoneNumber).then(usedPhoneNumber => {
            if (usedPhoneNumber) throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à ce numéro de téléphone)`);
        }).catch(err => {
            next(err);
        });

        const employeeToUpdate = {
            employeeNumber: employeeNumber,
            firstName: "" + firstName,
            lastName: "" + lastName,
            role: "" + role,
            colorHexCode: "" + colorHexCode,
            hourlyRate: hourlyRate,
            barcodeNumber: "" + barcodeNumber,
            email: "" + email,
            phoneNumber: "" + phoneNumber,
            isAdmin: isAdmin,
            skillPoints: skillPoints,
        };

        try {
            const updatedEmployee = employeeQueries.updateEmployeeByAdmin(employeeToUpdate);
            res.json(updatedEmployee);
        } catch (err) {
            return next(err);
        }
    });

module.exports = router;