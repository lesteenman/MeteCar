export function isAdmin(user) {
	return user && user.admin;
}

export function needsTeam(user) {
	return user && !(user.admin || user.team);
}
