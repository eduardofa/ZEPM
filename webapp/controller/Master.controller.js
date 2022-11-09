sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("tra0304.epm04.controller.Master", {
            onInit: function () {

            },
            _onPressItem: function(oEvent){
                //Resgatar a coluna clicada
                let oColumnListItem = oEvent.getSource();
                
                //Resgata o binding da coluna clicada, o modelo não tem nome, então getBindingContext fica sem parâmetro
                let oItem = oColumnListItem.getBindingContext().getObject();

                //Resgata o Id do Parceiro
                let iPartnerId = oItem.PartnerId;

                //Resgata o Roteador
                let oRouter = this.getOwnerComponent().getRouter();

                oRouter.navTo("RouteEditar", {
                    PartnerId: iPartnerId
                })
            },
            add_onclick: function(oEvent){
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteAdicionar");
            }
        });
    });
