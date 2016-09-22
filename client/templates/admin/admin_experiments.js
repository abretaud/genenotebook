Session.set('editExperiments',[])

Template.admin_experiments.helpers({
	edit : function(ID){
		const edit = Session.get('editExperiments');
		return edit.indexOf(ID) > -1;
	}
})

Template.admin_experiments.events({
	'click .edit':function(event){
		const id = event.target.id;
		const edit = Session.get('editExperiments');
		edit.push(id);
		Session.set('editExperiments',edit);
	},
	'click .cancel':function(event){
		const id = event.target.form.id;
		const edit = Session.get('editExperiments');
		const index = edit.indexOf(id);
		if (index > -1){
			edit.splice(index,1);
		}
		Session.set('editExperiments',edit);
	},
	'click .save':function(event, template){
		const id = event.target.form.id;
		const selector = '#' + id.replace(/(:|\.|\[|\]|,|\/)/g,'\\$1')
		const data = {
			ID: template.find('#name').value,
			experiment: template.find('#experiment').value,
			description: template.find('#description').value
		}		
		Meteor.call('experiments.update',this._id,data)
		const edit = Session.get('editExperiments');
		const index = edit.indexOf(id);
		if (index > -1){
			edit.splice(index,1);
		}
		Session.set('editExperiments',edit);
	}
})