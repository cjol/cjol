module.exports =
{
	"name": "JSTyper",
	"slug": "jstyper",
	"languages": ["javascript", "OTT", "LaTeX"],
	"img": "/img/screenshots/jstyper.png",
	"desc": "Formally verified JavaScript type-checker and \"gradual typing\" compiler",
	"description": `
<p>
	For my undergraduate dissertation at Cambridge, I set myself the ambitious task of writing a type-checker for JavaScript. Other projects
	exist for this, such as Flow or TypeScript, however they all required annotations. I wanted to see whether it was possible to
	do this without any modifications to the code.
</p>
<p>
	JavaScript is an inherently dynamic language, so it will not always be possible
	to statically analyse code in this way. Instead, JSTyper starts from the assumption that we have an incomplete view of the code,
	and that there is more JavaScript present which cannot be guaranteed to be type-safe. To handle this, JSTyper can optionally
	insert runtime wrappers, which protect the statically-typed portions of the code from interference by the unchecked code.
</p>
<p>
	I was awarded a First for this dissertation and the rest of my undergraduate work.
</p>
	`,
	"codeLanguage": "javascript",
	"code": `
// Rule V_Obj
UglifyJS.AST_Object.prototype.check = function(gamma, dynamics) {

	// An object literal will generate a fresh type which we will bind properties to
	var memberType = {};
	var C = [];
	var W = [];
	var S = [];

	// an object's type can be derived as long as each of its members has a valid type
	for (var i = 0; i < this.properties.length; i++) {
		this.properties[i].parent = parent(this);
		this.properties[i].value.parent = parent(this.properties[i]);

		var judgement = this.properties[i].value.check(gamma, dynamics);
		C = C.concat(judgement.C);
		W = W.concat(judgement.W);
		S = S.concat(judgement.S);

		// generate a new Type for this property, which will be constrained by the value type
		var propType = gamma.getFreshType(undefined, {
			detail: 'prop ' + i + 'type of ',
			node: this
		});

		C.push(new Classes.Constraint(propType.id, judgement.T.id));
		memberType[this.properties[i].key] = propType.id;
		memberType[this.properties[i].key].node = this.properties[i];

		// thread gamma through to the next property
		gamma = judgement.gamma;
	}

	var T = new Classes.ObjectType({
		memberTypes: memberType
	});

	return new Classes.Judgement(T, C, gamma, W, S);
};`,
	"codeDescription": `
JSTyper has a formal rule specification, which can be mathematically proven to have desirable properties. Below I have included
the translation of one of these formal rules into JavaScript. Specifically, it is the rule for type-checking object literals. An
object literal is checked by recursively checking the types of all its values. The remaining rules are all visible here:
<a href="https://github.com/cjol/jstyper/blob/master/src/judgements.js">Github Link</a>
	`,
	order: 5
}
