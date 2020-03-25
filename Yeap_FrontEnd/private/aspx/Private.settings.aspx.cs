using Yeap_FrontEnd.MasterPages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Yeap_FrontEnd.Pages
{
	// Code behind comune a tutte le pagine "figlie" di Private.master
	public partial class Private_settings : System.Web.UI.Page {
	
		public string Ver = "";
		protected void Page_Load(object sender,EventArgs e) {
			
			Ver = ((Private)this.Master).ExportVersion;					// Eredita il nr. versione determinato nella Master

		}
	}
}