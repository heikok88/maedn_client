angular.module("maedn", ["ngRoute", "match", "matches"])

.config(function($routeProvider) {
	$routeProvider
		.when("/", {
			controller: "MatchesCtrl",
			templateUrl: "matches.html"
		})
		.when("/match/:matchId", {
			controller: "MatchCtrl",
			templateUrl: "match.html"
		})
		.otherwise({
			redirectTo: "/"
		});
});
