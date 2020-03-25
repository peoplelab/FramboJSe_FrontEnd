<%@ Page Title="" Language="C#" MasterPageFile="~/private/aspx/Private.Master" AutoEventWireup="true" CodeBehind="controllo.aspx.cs" Inherits="Yeap.Pages.controllo" %>
<asp:Content ID="Content6" ContentPlaceHolderID="cph_head" runat="server">

    <%-- Script personalizzati --%>
    <script type="text/javascript">
		SystemJS.import('router').then(function(router) {
			router.init({
                Sector: 'controllo'
			});
		});
    </script>

    <%-- CSS personalizzati --%>
	<link rel="stylesheet" type="text/css" href="/private/resources/css/datagrid.pvt.min.css<% =Ver %>" />

</asp:Content>


<asp:Content ID="c_sitemap" ContentPlaceHolderID="cph_sitemap" runat="server">
	<section id="siteMap"></section>
</asp:Content>

<asp:Content ID="c_dashboard" ContentPlaceHolderID="cph_dashboard" runat="server">
	<section id="dashboard"></section>
</asp:Content>

<asp:Content ID="c_pageBody" ContentPlaceHolderID="cph_pageBody" runat="server">
	<section id="pageContent" class="default margin-b-50 clearfix">		
		<div id="menuContainer"></div>
		<div id="mainContainer">
			<div id="pageContainer" class="container-fluid default padding-t-30 margin-t-30 margin-b-50"></div>
        </div>
	    <script type="text/javascript" src="/System/3rd-parties/jquery-ui/jquery-ui.min.js"></script>
	</section>
</asp:Content>
