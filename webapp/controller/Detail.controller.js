sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, MessageToast, History, UIComponent) {
        "use strict";

        return Controller.extend("tra0304.epm04.controller.Detail", {
            onInit: function () {

                this.inicializarModelosLocais();

                //resgata o roteador
                let oRouter = this.getOwnerComponent().getRouter();
                //regata o modelo
                let oModel = this.getOwnerComponent().getModel();
                //resgata a view
                let oView = this.getView();
                oView.byId("formParceiro").setBusy(false);
                //resgata o controller
                let oController = this;

                //Acessa a rota de detalhe, anexa o event de 
                //partternmatched e declara função de callback para
                //quando o event for chamado
                oRouter.getRoute("RouteEditar").attachPatternMatched(function(oEvent){
                    
                    //Acessar o nome da rota
                    let sRota = oEvent.getParameter("name");
                    
                    if(sRota === "RouteEditar"){
                        oController._setEditable(false);
                    }
                    
                    //acessa os argumentos do evento
                    let oArgumentos = oEvent.getParameter("arguments");

                    //Acessa o PartnerId
                    let iPartnerId = oArgumentos.PartnerId;

                    //gera o caminho do modelo
                    let sPath = oModel.createKey("/BusinessPartners",{
                        PartnerId: iPartnerId
                    });
                    
                    oView.bindElement(sPath);
                });

                oRouter.getRoute("RouteAdicionar").attachPatternMatched(function(oEvent){
                    this.setarPropriedadeModelo("editavel", "/editavel", true);
                    //habilitar o modo de edição
                    this.setarPropriedadeModelo("botoes", "/editar", true);
                    //desabilitar o modo de visualização
                    this.setarPropriedadeModelo("botoes", "/visualizar", false);

                    var oContext = oModel.createEntry("/BusinessPartners", {
                        properties: {
                            PartnerId: "",
                            PartnerType: "",
                            PartnerName1: "",
                            PartnerName2: "",
                            SearchTerm1: "",
                            SearchTerm2: "",
                            Street: "",
                            HouseNumber: "",
                            District: "",
                            City: "",
                            Region: "",
                            ZipCode: "",
                            Country: ""
                        }
                    });
                    oView.bindElement(oContext.getPath());
                }.bind(this));
            },
            _setEditable: function(bValor) {
                let oModel = new JSONModel();
                let sEdit  = "";
                
                if(bValor){
                    //carrega modelo editável a partir do arquivo abaixo
                    // oModel.loadData("../model/formEditable.json");
                    sEdit = "./model/formEditable.json";
                } else {
                    //carrega modelo não editável a partir do arquivo abaixo
                    // oModel.loadData("../model/formUnEditable.json");
                    sEdit = "./model/formUneditable.json";
                }
                // let sPath = jQuery.sap.getModulePath("tra0304/epm04/", sEdit)
                oModel.loadData(sEdit);
                
                this.getView().setModel(oModel, "editavel");
            },
            editar_onclick: function(oEvent){
                //habilitar o modo de edição
                this.setarPropriedadeModelo("editavel", "/editavel", true);
                //habilitar o modo de edição
                this.setarPropriedadeModelo("botoes", "/editar", true);
                //desabilitar o modo de visualização
                this.setarPropriedadeModelo("botoes", "/visualizar", false);

                //Guarda o path que deve retornar se cancelar
                this.sCaminhoContexto = this.getView().getBindingContext().getPath()
            },
            back_onclick: function(oEvent){
                
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMaster", {}, true);
                }
            },
            cancel_onclick: function(oEvent){
                
                var oDados = this.getView().getBindingContext().getObject();
                                
                MessageBox.show("Você está presta a cancelar, os dados serão perdidos! Deseja cancelar?",{
                    title: "Cancelamento de edição",
                    actions:[
                        MessageBox.Action.YES, MessageBox.Action.NO
                    ],
                    onClose: function(oAction){

                        if(oAction == MessageBox.Action.YES){
                            if(oDados.PartnerId){
                                // //altera o valor da propriedade "editavel"
                                // oModel.setProperty("/editavel", false);
                                this.setarPropriedadeModelo("editavel", "/editavel", false);
                                //habilitar o modo de edição
                                this.setarPropriedadeModelo("botoes", "/editar", false);
                                //desabilitar o modo de visualização
                                this.setarPropriedadeModelo("botoes", "/visualizar", true);

                                //resgatar o modelo
                                let oModel = this.getView().getModel();
                                //criar array com um elemento dentro - o caminho do contexto
                                let aCaminhos = [
                                    this.sCaminhoContexto
                                ];

                                oModel.resetChanges(aCaminhos);//ODataModel
                            } else {
                                this.getOwnerComponent().getRouter().navTo("RouteMaster", true);
                            }
                        }
                    }.bind(this) //salva o contexto do this apontando para o controller, o que ocorre fora da função
                });

            },
            inicializarModelosLocais: function(){
                
                //criar nova instância de um modelo JSON
                var oModeloBotao = new JSONModel();
                //criar propriedade visualizar que controla o modo visualização
                oModeloBotao.setProperty("/visualizar", true);
                //criar propriedade visualizar que controla o modo edição
                oModeloBotao.setProperty('/editar', false);

                var oView = this.getView();
                //XMLView
                oView.setModel(oModeloBotao, "botoes");

            },
            setarPropriedadeModelo:function(sModelo, sPropriedade, bValor){
                var oModel = this.getView().getModel(sModelo);
                
                if(oModel){
                    oModel.setProperty(sPropriedade, bValor);
                }
            },
            save_onclick: function(oEvent){
                let oRouter = this.getOwnerComponent().getRouter();
                //resgatar o modelo
                let oModel = this.getView().getModel();
                var oDados = this.getView().getBindingContext().getObject();
                var oForm = this.getView().byId("formParceiro");
                oForm.setBusy(true);

                if(oDados.PartnerId){
                    MessageBox.show("Deseja salvar as alterações?",{
                        title: "Pergunta",
                        actions:[
                            MessageBox.Action.YES, MessageBox.Action.NO
                        ],
                        onClose: function(oAction){
    
                            if(oAction == MessageBox.Action.YES){
        
                                oModel.update(this.sCaminhoContexto, oDados, {
                                    success: function(){
    
                                        MessageToast.show(
                                            "Atualização do parceiro " + 
                                            oDados.PartnerId +
                                            " realizada com sucesso!"
                                        );
                                        oForm.setBusy(false);
    
                                        // //altera o valor da propriedade "editavel"
                                        // oModel.setProperty("/editavel", false);
                                        this.setarPropriedadeModelo("editavel", "/editavel", false);
                                        //habilitar o modo de edição
                                        this.setarPropriedadeModelo("botoes", "/editar", false);
                                        //desabilitar o modo de visualização
                                        this.setarPropriedadeModelo("botoes", "/visualizar", true);
    
                                    }.bind(this),
                                    error: function(){
                                        oForm.setBusy(false);
                                        MessageBox.error(
                                            "Erro ao atualizar parceiro " + 
                                            oDados.PartnerId);
                                    }.bind(this)
                                });//ODataModel                               
                            }
                        }.bind(this) //salva o contexto do this apontando para o controller, o que ocorre fora da função
                    });
                } else {
                    oModel.create("/BusinessPartners", oDados,{
                        success: function(oData){
                            MessageToast.show(
                                "Parceiro " + 
                                oDados.PartnerId +
                                " criado!");
                            oForm.setBusy(false);
                            oRouter.navTo("RouteMaster", true);
                        },
                        error: function(oError){
                            
                            let oErro = JSON.parse(oError.responseText);
                            MessageBox.show(oErro.error.message.value);

                            oForm.setBusy(false);
                        }
                    });
                }

                
            },
            zipcode_onchange: function(oEvent){
                //Acessa o valor do input
                let sValor = oEvent.getParameter("value");

                //resgata o input
                var oInput = oEvent.getSource();

                if(sValor.length !== 9){
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                } else {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
            }
        });
    });
