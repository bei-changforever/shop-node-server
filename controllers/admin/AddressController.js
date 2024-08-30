
const JWT = require('../../util/JWT')
const addressService = require('../../services/admin/addressService')
const addressController = {
    add: async (req, res) => {
        // console.log(req.body);

        //判断当前用户
        const token = req.headers['authorization'].split(" ")[1]
        const playload = JWT.verify(token)
        // console.log(username);
        const { name, tel, city, country, county, province, areaCode, isDefault, addressDetail, thisid } = req.body
        let result = await addressService.getList(playload)

        if (isDefault && thisid == 1) {
            //添加前进行索引
            if (result.length > 0) {
                //执行更新数据
                // console.log(result);
                await addressService.updatedown({
                    username: playload.username,
                    isDefault: false,
                    thisid: 2
                })
            }
        }



        await addressService.add(
            {
                username: playload.username,
                name,
                tel,
                city,
                country,
                county,
                province,
                areaCode,
                isDefault,
                addressDetail,
                editTime: new Date(),
                thisid
            }
        )
        res.send({
            code: 4000,
            message: '地址保存成功'
        })
    },
    getList: async (req, res) => {

        //判断当前用户
        const token = req.headers['authorization'].split(" ")[1]
        let playload = JWT.verify(token)

        if (token) {
            let result = await addressService.getList(playload)
            res.send({
                code: 4000,
                data: result
            })
        }

    },
    editList: async (req, res) => {

        const { thisid, username, _id, name, tel, city, county, country, province, areaCode, isDefault, addressDetail } = req.body

        //判断当前用户
        const token = req.headers['authorization'].split(" ")[1]
        let playload = JWT.verify(token)

        if (playload.username == req.body.username) {


            let result = await addressService.getList(playload)

            if (isDefault && thisid == 1) {
                //添加前进行索引
                if (result.length > 0) {
                    //执行更新数据
                    // console.log(result);
                    await addressService.updatedown({
                        username: playload.username,
                        isDefault: false,
                        thisid: 2
                    })
                }
            }


            await addressService.editAddress({
                thisid,
                username,
                _id,
                name, 
                tel,
                city,
                county,
                country,
                province,
                areaCode,
                isDefault,
                addressDetail,
                editTime: new Date()
            })


            res.send({
                code: 4000,
                message: '更新成功'
            })

        }


    },
    delAddress: async (req,res) => {
        // console.log(req.params);
        let id = req.params.id
        await addressService.delAddress(id)
        res.send({
            code: 4000,
            messgae: '删除成功'
        })
    }
}

module.exports = addressController