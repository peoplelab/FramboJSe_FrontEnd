<%@ Page Title="" Language="C#" MasterPageFile="~/public/aspx/Public.Master" AutoEventWireup="true" CodeBehind="bp-home.aspx.cs" Inherits="Yeap.Pages.bp_home" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cph_head" runat="server">
    <script type="text/javascript">

		//SystemJS.import('router').then(function(router) {
		//	router.init({
        //        Sector: 'homePages'
		//	});
		//});

    </script>
</asp:Content>

<asp:Content ID="c_sitemap" ContentPlaceHolderID="cph_sitemap" runat="server">
	<section id="siteMap"></section>
</asp:Content>

<asp:Content ID="c_dashboard" ContentPlaceHolderID="cph_dashboard" runat="server">
	<section id="dashboard"></section>
</asp:Content>

<asp:Content ID="c_pageBody" ContentPlaceHolderID="cph_pageBody" runat="server">
	<section id="pageContent" class="container default margin-b-50">

		<h1>Test page</h1>
		rinominato - Ok

		Caratteri: à è ò ì ù € 
		<br>
		Perché così fuziona...
	</section>
</asp:Content>


<%--
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
</asp:Content>
--%>
