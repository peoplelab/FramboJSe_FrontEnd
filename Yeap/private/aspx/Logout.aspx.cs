using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Yeap.Pages
{
    public partial class Logout : System.Web.UI.Page
    {
        private const string LOGINPAGE = "/public/aspx/Home.aspx";

        protected void Page_Load(object sender, EventArgs e)
        {
            System.Web.Security.FormsAuthentication.SignOut();
            Session.Clear();
            Session.Abandon();
            Response.Redirect(LOGINPAGE);
        }
    }
}