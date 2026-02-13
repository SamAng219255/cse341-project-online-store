function match(value, condition, {
	maxDepth = 1000,
	partial = false
} = {}) {
	if (Object.is(value, condition))
		return true;
	if (Array.isArray(condition))
		return condition.includes(value);

	let conditionStack = [{ iterator: [condition][Symbol.iterator]() }];
	for(let i = 0; i < maxDepth; i++) {
		if(conditionStack.length < 1)
			return false;

		const step = conditionStack[0].iterator.next();
		if(step.done) {
			conditionStack.shift();
			continue;
		}
		const currentCondition = step.value;

		if(currentCondition != null && typeof currentCondition[Symbol.match] === 'function')
			return currentCondition[Symbol.match](value);
		if(typeof currentCondition === 'object' && typeof currentCondition.equals === 'function') {
			return currentCondition.equals(value);
		}
		if(typeof value === typeof currentCondition) {
			if(typeof value === 'object' && partial) {
				if(partial == 'value')
					return Object.keys(value).every(key => match(value[key], currentCondition[key]), {
						partial,
						maxDepth: maxDepth - i,
					});
				else
					return Object.keys(currentCondition).every(key => match(value[key], currentCondition[key]), {
						partial,
						maxDepth: maxDepth - i,
					});
			}
			else if(typeof value !== 'object' || value.constructor === currentCondition.constructor)
				return Object.is(value, currentCondition);
			else if(Object.is(value, currentCondition))
				return true;
		}
		if(currentCondition instanceof RegExp)
			return currentCondition.test(value);
		if(typeof currentCondition === 'function') {
			if(
				typeof value === 'object' &&
				(value.constructor === currentCondition || (
					currentCondition.prototype &&
					value instanceof currentCondition
				))
			)
				return true;
			else
				return currentCondition(value);
		}
		if(currentCondition != null && typeof currentCondition !== 'string' && typeof currentCondition[Symbol.iterator] === 'function') {
			conditionStack.unshift({iterator: currentCondition[Symbol.iterator]()});
			continue;	
		}
	}
	return false;
}

const reqAuthorize = ({
	mode = "every",
	idMatchesParam = false,
	accountTypeMatches = null,
} = {}) => {
	if(mode != "every" && mode != "some")
		throw new RangeError("reqAuthorize: 'mode' must be one of 'some' or 'every'.");

	const requirements = [];
	if(idMatchesParam) requirements.push((req, res) => req.params[idMatchesParam] === req.user.id);
	if(accountTypeMatches != null) requirements.push((req, res) => match(req.user.accountType, accountTypeMatches));

	if(requirements.length == 0)
		return (req, res, next) => {
			if(req.user == undefined)
				return res.status(401).json({ message: "You require authorization to use this endpoint." });
			else
				return next();
		};
	else
		return (req, res, next) => {
			if(req.user == undefined)
				return res.status(401).json({ message: "You require authorization to use this endpoint." });

			else if(requirements[mode](requirement => requirement(req, res)))
				return next();

			else
				return res.status(403).json({ message: "You are not authorized to make this request." });
		};
};

module.exports =  reqAuthorize;
