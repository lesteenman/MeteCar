import React, { Component } from 'react';
import Helmet from 'react-helmet';

import TitledPage from '../ui/TitledPage.jsx';
import PaperPage from '../ui/PaperPage.jsx';

export default class DashboardPage extends TitledPage {
	getTitle() { return 'dashboard'; }

	pageRender() {
		return (
			<PaperPage>
				Hier gaat Colin een hele mooie dashboard pagina ontwerpen.
			</PaperPage>
		)
	}
}
