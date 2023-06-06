const exphbs = require("express-handlebars")

var hbs = exphbs.create({
    helpers: {
        details: function (attr) {
            var html = "";

            if (attr.length <= 4) {
                for (let i = 0; i < attr.length; i++) {
                    html += `
                        <tr>
                            <td>${attr[i].OzAdi}</td>
                            <td>${attr[i].OzDegeri}</td>
                        </tr>`;
                }
            }
            else {
                for (let i = 0; i < 4; i++) {
                    html += `
                    <tr>
                        <td>${attr[i].OzAdi}</td>
                        <td>${attr[i].OzDegeri}</td>
                    </tr>`;
                }
            }
            return html;
        },
        fulldetails: function (attr) {
            var html = "";
            for (i = 0; i < attr.length; i += 2) {

                if (attr.length % 2 == 1 && i == attr.length - 1) {
                    html += `<tr>
                            <td>${attr[i].OzAdi}</td>
                            
                        </tr>
                        <tr>
                            <th>${attr[i].OzDegeri}</th>
                            
                        </tr>`;
                }
                else {
                    html += `<tr>
                            <td>${attr[i].OzAdi}</td>
                            <td>${attr[i+1].OzAdi}</td>
                        </tr>
                        <tr>
                            <th>${attr[i].OzDegeri}</th>
                            <th>${attr[i+1].OzDegeri}</th>
                        </tr>`;
                }
            }
            return html;

        },

        // details: function (attr) {
        //     var html = "";

        //     if (attr.length <= 4) {
        //         for (let i = 0; i < attr.length; i++) {
        //             html += `
        //                 <tr>
        //                     <td>${Object.keys(attr[i])}</td>
        //                     <td>${Object.values(attr[i])}</td>
        //                 </tr>`;
        //         }
        //     }
        //     else {
        //         for (let i = 0; i < 4; i++) {
        //             html += `
        //             <tr>
        //                 <td>${Object.keys(attr[i])}</td>
        //                 <td>${Object.values(attr[i])}</td>
        //             </tr>`;
        //         }
        //     }
        //     return html;
        // },
        // fulldetails: function (attr) {
        //     var html = "";
        //     for (i = 0; i < attr.length; i += 2) {

        //         if (attr.length % 2 == 1 && i == attr.length - 1) {
        //             html += `<tr>
        //                     <td>${Object.keys(attr[i])}</td>
                            
        //                 </tr>
        //                 <tr>
        //                     <th>${Object.values(attr[i])}</th>
                            
        //                 </tr>`;
        //         }
        //         else {
        //             html += `<tr>
        //                     <td>${Object.keys(attr[i])}</td>
        //                     <td>${Object.keys(attr[i + 1])}</td>
        //                 </tr>
        //                 <tr>
        //                     <th>${Object.values(attr[i])}</th>
        //                     <th>${Object.values(attr[i + 1])}</th>
        //                 </tr>`;
        //         }
        //     }
        //     return html;

        // },
        totalprice: function (prd) {
            var totprice = 0;
            prd.forEach(prd => {
                if (prd.discount) {
                    totprice += prd.discprice;
                }
                else {
                    totprice += prd.price;
                }
            });
            return totprice;
        },
        totalproduct: function (prd) {
            return prd.length;
        },
        postAdress: function (adress) {
            return JSON.stringify(adress)
        }

    }
});

module.exports = hbs;

