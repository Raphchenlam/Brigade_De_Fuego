const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD POUR CREATION EMPLOYEE
const crypto = require('crypto');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

const employeeQueries = require('../queries/employeeQueries');

router.get('/',
    // passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        // const employee = req.employee;

        // if (!employee || !employee.isAdmin || !employee.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // }

        employeeQueries.selectAllEmployees().then(employees => {
            res.json(employees);
        }).catch(err => {
            return next(err);
        });
    });

router.get('/role', (req, res, next) => {
    // const employeeConnected = req.employee;
    // if (!employeeConnected) {
    //     return next(new HttpError(401, "Vous devez etre connecté"));
    // };
    // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
    //     return next(new HttpError(403, "Droit administrateur requis"));
    // };

    employeeQueries.selectAllRoles().then(roleList => {
        res.json(roleList);
    }).catch(err => {
        return next(err);
    });
});

router.get('/:employeeNumber', (req, res, next) => {
    // const employeeConnected = req.employee;
    const employeeNumberToGet = req.params.employeeNumber;

    // if (!employeeConnected) {
    //     return next(new HttpError(401, "Vous devez etre connecté"));
    // };
    // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
    //     return next(new HttpError(403, "Droit administrateur requis"));
    // };
    // if (employeeConnected.employeeNumber != employeeNumberToGet) {
    //     return next(new HttpError(403, "Vous ne pouvez pas acceder aux informations d'un autre employé"));
    // };
    employeeQueries.selectEmployeeByEmployeeNumber(employeeNumberToGet).then(employee => {
        if (employee) {
            res.json(employee);
        } else {
            return next(new HttpError(404, `Employé avec le numéro ${employeeNumberToGet} inexistant ou introuvable`));
        }
    }).catch(err => {
        return next(err);
    });
});


router.get('/role/:role', (req, res, next) => {
    // const employeeConnected = req.employee;
    const role = req.params.role;
    // if (!employeeConnected) {
    //     return next(new HttpError(401, "Vous devez etre connecté"));
    // };
    // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
    //     return next(new HttpError(403, "Droit administrateur requis"));
    // };

    employeeQueries.selectAllEmployeesByRole(role).then(employeeList => {
        res.json(employeeList);
    }).catch(err => {
        return next(err);
    });
});

router.post('/',
    //passport.authenticate('basic', {session:false}),
    (req, res, next) => {
        // const employee = req.employee;

        // if(!employee || !employee.isAdmin || !employee.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // }

        const employeeNumber = req.body.employeeNumber;
        if (!employeeNumber || employeeNumber == '') {
            return next(new HttpError(400, 'Le champ employeeNumber est requis'));
        }
        if (!regex.validEmployeeNumber.test(employeeNumber)) {
            return next(new HttpError(400, 'Le numéro d\'employé ne respecte pas les critères d\'acceptation'));
        }
        employeeQueries.selectEmployeeByEmployeeNumber(employeeNumber).then(employee => {
            if (employee) {
                throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à ce numéro d'employé`);
            }
        }).catch(err => {
            next(err);
        });


        const firstName = req.body.firstName;
        if (!firstName || firstName == '') {
            return next(new HttpError(400, 'Le champ firstName est requis'));
        }
        if (!regex.validName.test(firstName)) {
            return next(new HttpError(400, 'Le prénom ne respecte pas les critères d\'acceptation'));
        }


        const lastName = req.body.lastName;
        if (!lastName || lastName == '') {
            return next(new HttpError(400, 'Le champ lastName est requis'));
        }
        if (!regex.validName.test(lastName)) {
            return next(new HttpError(400, 'Le nom ne respecte pas les critères d\'acceptation'));
        }


        const role = req.body.role;
        if (!role || role == '') {
            return next(new HttpError(400, 'Le champ role est requis'));
        }
        if (!regex.validRole.test(role)) {
            return next(new HttpError(400, 'Le rôle ne respecte pas les critères d\'acceptation'));
        }
        employeeQueries.selectRoleByName(role).then(existingRole => {
            if (!existingRole) {
                throw new HttpError(400, `Le role ${role} n'existe pas`);
            }
        });


        const colorHexCode = req.body.colorHexCode;
        if (!colorHexCode || colorHexCode == '') {
            return next(new HttpError(400, 'Le champ colorHexCode est requis'));
        }
        if (!regex.validColorHexCode.test(colorHexCode)) {
            return next(new HttpError(400, 'Le champ colorHexCode ne respecte pas les critères d\'acceptation'));
        }
        employeeQueries.selectAssignedColorHexcode(colorHexCode).then(assignedColorHexcode => {
            if (assignedColorHexcode) {
                throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à cette couleur`);
            }
        });


        const hourlyRate = req.body.hourlyRate;
        if (!hourlyRate || hourlyRate == '') {
            return next(new HttpError(400, 'Le champ hourlyRate est requis'));
        }
        if (!regex.validHourlyRate.test(hourlyRate)) {
            return next(new HttpError(400, 'Le champ hourlyRate ne respecte pas les critères d\'acceptation'));
        }


        const barcodeNumber = req.body.barcodeNumber;

        if (!barcodeNumber || barcodeNumber == '') {
            return next(new HttpError(400, 'Le champ barcodeNumber est requis'));
        }
        if (!regex.validBarcodeNumber.test(barcodeNumber)) {
            return next(new HttpError(400, 'Le champ barcodeNumber ne respecte pas les critères d\'acceptation'));
        }


        const email = req.body.email;
        if (!email || email == '') {
            return next(new HttpError(400, 'Le champ email est requis'));
        }
        if (!regex.validEmail.test(email)) {
            return next(new HttpError(400, 'Le champ email ne respecte pas les critères d\'acceptation'));
        }
        employeeQueries.selectUsedEmail(email).then(usedEmail => {
            if (usedEmail) {
                throw new HttpError(400, `Cette adresse courriel est déjà utilisée`);
            }
        });


        const phoneNumber = req.body.phoneNumber;
        if (!phoneNumber || phoneNumber == '') {
            return next(new HttpError(400, 'Le champ phoneNumber est requis'));
        }
        if (!regex.validPhoneNumber.test(phoneNumber)) {
            return next(new HttpError(400, 'Le champ phoneNumber ne respecte pas les critères d\'acceptation'));
        }
        employeeQueries.selectUsedPhoneNumber(phoneNumber).then(usedPhoneNumber => {
            if (usedPhoneNumber) {
                throw new HttpError(400, 'Ce numéro de téléphone est déjà utilisé');
            }
        });


        const isAdmin = req.body.isAdmin;

        const skillPoints = req.body.skillPoints;
        if (!skillPoints || skillPoints == '') {
            return next(new HttpError(400, 'Le champ skillPoints est requis'));
        }
        if (!regex.validSkillPoints.test(skillPoints)) {
            return next(new HttpError(400, 'Le champ skillPoints ne respecte pas les critères d\'acceptation'));
        }

        const newEmployee = {
            employeeNumber: parseInt(employeeNumber),
            firstName: "" + firstName,
            lastName: "" + lastName,
            role: "" + role,
            colorHexCode: "" + colorHexCode,
            hourlyRate: parseFloat(hourlyRate),
            barcodeNumber: "" + barcodeNumber,
            email: "" + email,
            phoneNumber: "" + phoneNumber,
            isAdmin: isAdmin,
            skillPoints: parseInt(skillPoints),
        };

        const password = req.body.password;
        if (!password || password == '') {
            return next(new HttpError(400, 'Le champ password est requis'));
        }

        const saltBuf = crypto.randomBytes(16);
        const passwordSalt = saltBuf.toString("base64");

        crypto.pbkdf2(password, passwordSalt, 100000, 64, "sha512", async (err, derivedKey) => {
            if (err) {
                return next(err);
            }

            const passwordHashBase64 = derivedKey.toString("base64");

            try {
                const employeeAccountWithPasswordHash = await employeeQueries.insertEmployee(newEmployee, passwordSalt, passwordHashBase64);
                res.json(employeeAccountWithPasswordHash);
            } catch (err) {
                return next(err);
            }
        });
    });

module.exports = router;