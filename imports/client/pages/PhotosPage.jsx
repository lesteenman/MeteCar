import React, { Component } from 'react';

import PaperPage from '../ui/PaperPage.jsx';
import TitledPage from '../ui/TitledPage.jsx';

export default class PhotosPage extends TitledPage {
	getTitle() {
		console.log('Using the custom getTitle');
		return  "photos";
	}

	pageRender() {
		// Use GridList
		return (
			<div>
				<PaperPage>
					There will be a vertical list of all missions that involve photos here. Clicking one of those rows will take you to the page of that mission, showing each photo of each team.
				</PaperPage>
				<PaperPage>
					Admins can always see all missions, while others can only see missions that have been publicized (once they have been finished by most teams, probably?), or missions they currently have open, but then only their own photo.
				</PaperPage>
			</div>
		);
	}
}
