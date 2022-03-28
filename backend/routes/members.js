const express = require('express');

const Member = require('../models/member');

const router = express.Router();

router.post('', (req, res, next) => {
  const member = new Member({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    city: req.body.city,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    dateJoined: req.body.dateJoined,
    rating: req.body.rating,
    peakRating: req.body.rating,
  });
  member.save().then((addedMember) => {
    res.status(201).json({
      statusCode: 201,
      payload: {
        addedMember: addedMember,
      },
    });
  });
});

router.get('', (req, res, next) => {
  Member.find().then((members) => {
    res.status(200).json({
      statusCode: 200,
      payload: {
        allMembers: members,
      },
    });
  });
});

router.get('/:id', (req, res, next) => {
  Member.findById(req.params.id).then((member) => {
    if (member) {
      res.status(200).json({
        statusCode: 200,
        payload: {
          member: member,
        },
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        errorMessage: '[Server] Failed to find member',
      });
    }
  });
});

router.put('/:id', (req, res, next) => {
  const member = new Member({
    _id: req.body._id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    city: req.body.city,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    dateJoined: req.body.dateJoined,
    rating: req.body.rating,
    peakRating: req.body.peakRating,
  });
  Member.updateOne({ _id: req.params.id }, member).then((updateResult) => {
    if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 1) {
      res.status(200).json({
        statusCode: 200,
        payload: {
          member: member,
        },
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        errorMessage: `[Server] Failed to delete ${req.params.firstName}
                       ${req.params.lastName} from database`,
      });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Member.deleteOne({ _id: req.params.id }).then((deleteResult) => {
    if (deleteResult.deletedCount === 1) {
      res.status(200).json({
        statusCode: 200,
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        errorMessage: `[Server] Failed to delete ${req.params.firstName}
                       ${req.params.lastName} from database`,
      });
    }
  });
});

module.exports = router;
