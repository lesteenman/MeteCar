export function isAdmin(user) {
	return user && user.profile && user.profile.admin;
}

export function needsTeam(user) {
	return user && !(user.profile && (user.profile.admin || user.team));
}
