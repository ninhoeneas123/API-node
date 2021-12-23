import sendWelcomeMail from '../mail/send-welcome-email'
import SendRecoveryPassword from '../mail/send-recovery-password'
import UserCasesDataBase from '../database-cases/users-database-cases'
import bcrypt from 'bcrypt'


class UserCases {


     valityPassword(password: string) {
        let statusReturn
        var passwordSplit = password.split('')
        if (passwordSplit.length < 6) {
            statusReturn = {
                code: 400,
                return: {
                    message: 'Sua senha deve conter no minimo 6 carateres'
                }
            }
            return statusReturn
        }
    }
    async caseRegisterUser(data: any) {
        const userData = data
        let statusReturn
        const userEmail = await UserCasesDataBase.valitUserForEmail(userData.email)
        if (userEmail) {
            statusReturn = {
                code: 400,
                return: { message: "Email ja registrado em nosso sitema" }
            }
            return statusReturn
        }
        // const valityPassword = this.valityPassword(data.password)
        // if (valityPassword) {
        //     statusReturn = valityPassword
        //     return statusReturn
        // }
        await UserCasesDataBase.createUser(userData)
        statusReturn = {
            code: 200,
            message: { message: "Usuário Criado com sucesso" }
        }
        return statusReturn
    }

    async caseFindUser(data: any): Promise<any> {
        const userName = data
        let returnStatus = {}
        let dataResult

        if (userName) {
            dataResult = await UserCasesDataBase.findUserForName(userName)
            if (dataResult.length === 0) {
                returnStatus = {
                    code: 400,
                    return: { message: "Nenhum resultado para essa pesquisa" }
                }
                return returnStatus
            }
            returnStatus = {
                code: 201,
                return: dataResult
            }
            return returnStatus
        }
        dataResult = await UserCasesDataBase.findAllUsers()
        returnStatus = {
            code: 201,
            return: dataResult
        }
        return returnStatus
    }

    async newPassword(data: any, id: string) {
        let returnStatus
        if (!data.newPassword) {
            returnStatus = {
                code: 400,
                return: { message: "Por favor insira uma nova senha" }
            }
            return returnStatus
        }
        const valityPassword = this.valityPassword(data.newPassword)
        if (valityPassword) {
            returnStatus = valityPassword
            return returnStatus
        }

        await UserCasesDataBase.updateUser(id, data.newPassword)
        returnStatus = {
            code: 200,
            return: { message: "Senha alterada com sucesso" }
        }

        return returnStatus
    }

    async updateUser(data: any, id: string) {
        let returnStatus
        if (!data.name) {
            returnStatus = {
                code: 400,
                return: { message: "Por favor insira um nome valido" }
            }
            return returnStatus
        }
        await UserCasesDataBase.updateUserName(id, data.name)
        returnStatus = {
            code: 200,
            return: { message: "Dados alterados com sucesso" }
        }

        return returnStatus
    }

    async updateUserAddress(address: any, id: string) {
        let returnStatus
        if (Object.keys(address).length < 7) {
            returnStatus = {
                code: 400,
                return: { message: "Por favor insira todos os campos de endereço" }
            }
            return returnStatus
        }
        await UserCasesDataBase.updateUserAddress(id, address)
        returnStatus = {
            code: 400,
            return: { message: "Endereço alterado com sucesso" }
        }

        return returnStatus
    }
    async caseDeleteUser(id: string) {
        let returnStatus
        if (!id) {
            returnStatus = {
                code: 400,
                return: { message: "Por favor selecione um usuario para ser removido" }
            }
        }
        await UserCasesDataBase.removeUserAddress(id)
        returnStatus = {
            code: 200,
            return: { message: "Usuario excluido com sucesso" },
        }
        return returnStatus
    }

    async createSuperAdmin() {
        const superAdmin = await UserCasesDataBase.valitUserForEmail(process.env.SUPER_ADMIN_EMAIL)
        if (!superAdmin) {
            const hashPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 8);
            const superAdmin = {
                "name": process.env.SUPER_ADMIN_NAME,
                "password": hashPassword,
                "email": process.env.SUPER_ADMIN_EMAIL,
                "function": "ADMIN",
                "admin": true,
                "address": {
                    "zipcode": "XXXXXXX-XXXXXX",
                    "number": "XXX",
                    "street": "Rua dos admins",
                    "district": "Arkahan",
                    "city": "Arkahan.city",
                    "state": "CA",
                    "country": "US"
                }
            }
            await UserCasesDataBase.createUser(superAdmin)
            console.log("Super Admin create")
        }
    }
}
export default new UserCases()
