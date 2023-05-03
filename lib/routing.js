import { objects } from 'mielk-fn';

//Return JSON definitions.
const getJson = (data) => ({
	status: 1,
	count: data?.length || 0,
	items: data,
});

const postJson = (data) => ({
	status: 1,
	result: data,
});

const putJson = (data) => {
	if (objects.isObject(data)) {
		return {
			status: 1,
			affectedRows: 1,
			result: data,
		};
	} else if (data > 0) {
		return {
			status: 1,
			affectedRows: data,
		};
	} else {
		return {
			status: 0,
			message: 'No record updated',
		};
	}
};

const deleteJson = () => undefined;

//Handlers.
const handleAction = async (res, fn, fnJson, successCode = 200) => {
	try {
		const data = await fn();
		const json = fnJson(data);
		res.status(successCode);
		if (json) res.json(json);
		res.send();
	} catch (err) {
		res.status(500);
		res.json({
			status: 0,
			message: err.message,
		});
	}
};

const handleGet = async (res, fn) => await handleAction(res, fn, getJson);

const handlePost = async (res, fn) => await handleAction(res, fn, postJson, 201);

const handlePut = async (res, fn) => await handleAction(res, fn, putJson);

const handleDelete = async (res, fn) => await handleAction(res, fn, deleteJson, 204);

export default { handleGet, handlePost, handlePut, handleDelete };
