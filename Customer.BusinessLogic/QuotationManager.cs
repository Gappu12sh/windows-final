﻿using AutoMapper;
using Customer.BusinessLogic.Interfaces;
using Customer.Data.Application;
using Customer.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Text;
using System.Threading.Tasks;

namespace Customer.BusinessLogic
{
    public class QuotationManager : BaseManager, IQuotation
    {
        public QuotationManager(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public ResponseResults CreateQuotation(QuotationMasterModel model)
        {
            var currentUser = GetCurrentUser();
            model.QuotationRepresentative = _unitOfWork.PartyAddress.FindAll().Include(x => x.Representatives).FirstOrDefault(x => x.PartyAddress_Id == model.AddressId).Representatives.Rep_Name;
            var mapEntity = Mapper.Map<QuotationMaster>(model);
            mapEntity.Quotation_Created_By = currentUser.CurrentUserId;
            mapEntity.Quotation_DOE = DateTime.Now;
            mapEntity.IsActive = true;
            mapEntity.FinancialYearId = _unitOfWork.FinancialYear.FindAll().FirstOrDefault(x => x.IsActive).FinancialYear_Id;
            foreach (var item in mapEntity.QuotationDetails)
            {
                item.Quotation_DOE = DateTime.Now;
                item.QuotationDetails_Created_By = currentUser.CurrentUserId;
                item.IsActive = true;
            }
            _unitOfWork.QuotationMaster.Insert(mapEntity);
            _unitOfWork.Save();
            return new ResponseResults();
        }

        public ResponseResults<QuotationMasterModel> GetQuotationById(int quotationId)
        {
            var quotationEntity = _unitOfWork.QuotationMaster.FindAll()
                 .Include(x => x.UserDetailsCreatedBy)
                 .Include(x => x.UserDetailsUpdatedBy)
                 .Include(x => x.QuotationDetails)
                 .Include(x => x.QuotationDetails.Select(y => y.Quantity))
                 .Include(x => x.QuotationDetails.Select(y => y.UserDetailsCreatedBy))
                 .Include(x => x.QuotationDetails.Select(y => y.UserDetailsUpdatedBy))
                 .FirstOrDefault(x => x.QuotationMasterId == quotationId);

            var mapModel = Mapper.Map<QuotationMasterModel>(quotationEntity);
            mapModel.QuotationDetails = mapModel.QuotationDetails.Where(x => x.IsActive == true).ToList();
            return new ResponseResults<QuotationMasterModel>(mapModel);
        }

        public ResponseResults<QuotationMasterModel> GetQuotationBySampleName(string sampleName, int partyId)
        {
            var quotationEntity = _unitOfWork.QuotationMaster.FindAll()
                 .Include(x => x.UserDetailsCreatedBy)
                 .Include(x => x.UserDetailsUpdatedBy)
                 .Include(x => x.QuotationDetails)
                 .Include(x => x.QuotationDetails.Select(y => y.Quantity))
                 .Include(x => x.QuotationDetails.Select(y => y.UserDetailsCreatedBy))
                 .Include(x => x.QuotationDetails.Select(y => y.UserDetailsUpdatedBy))
                 .Where(x => x.PartyId == partyId && x.IsActive).ToList();

            var entity = quotationEntity.Where(x => x.QuotationDetails.Any(y => y.SampleName.Trim().ToUpper() == sampleName.Trim().ToUpper() && y.IsActive)).ToList();
            var mapModel = Mapper.Map<QuotationMasterModel>(entity.FirstOrDefault());
            return new ResponseResults<QuotationMasterModel>(mapModel);
        }

        public ResponseResults<List<QuotationMasterModel>> GetQuotationList()
        {
            var quotationEntity = _unitOfWork.QuotationMaster.FindAll()
                .Include(x => x.UserDetailsCreatedBy)
                .Include(x => x.UserDetailsUpdatedBy)
                .Include(x => x.QuotationDetails)
                .Include(x => x.QuotationDetails.Select(y => y.UserDetailsCreatedBy))
                .Include(x => x.QuotationDetails.Select(y => y.UserDetailsUpdatedBy))
                .Where(x => x.IsActive).ToList();
            var mapModel = Mapper.Map<List<QuotationMasterModel>>(quotationEntity);
            return new ResponseResults<List<QuotationMasterModel>>(mapModel);
        }

        public ResponseResults<List<QuotationMasterModel>> GetQuotationListByParty(int partyId)
        {
            var quotationEntity = _unitOfWork.QuotationMaster.FindAll()
                 .Include(x => x.UserDetailsCreatedBy)
                 .Include(x => x.UserDetailsUpdatedBy)
                 .Include(x => x.QuotationDetails)
                 .Include(x => x.QuotationDetails.Select(y => y.Quantity))
                 .Include(x => x.QuotationDetails.Select(y => y.UserDetailsCreatedBy))
                 .Include(x => x.QuotationDetails.Select(y => y.UserDetailsUpdatedBy))
                 .Where(x => x.PartyId == partyId).ToList();

            var mapModel = Mapper.Map<List<QuotationMasterModel>>(quotationEntity);
            mapModel.ForEach(x => x.QuotationDetails = x.QuotationDetails.Where(y => y.IsActive).ToList());
            return new ResponseResults<List<QuotationMasterModel>>(mapModel);
        }

        public ResponseResults UpdateQuotation(QuotationMasterModel model)
        {
            var currentUser = GetCurrentUser();
            model.QuotationRepresentative = _unitOfWork.PartyAddress.FindAll().Include(x => x.Representatives).FirstOrDefault(x => x.PartyAddress_Id == model.AddressId).Representatives.Rep_Name;
            var quotationMaster = _unitOfWork.QuotationMaster.FindAll()
                .Include(x => x.QuotationDetails)
                .FirstOrDefault(x => x.QuotationMasterId == model.QuotationMasterId);
            quotationMaster.QuotationNo = model.QuotationNo;
            quotationMaster.RegisterNo = model.RegisterNo;
            quotationMaster.PartyId = model.PartyId;
            quotationMaster.AddressId = model.AddressId;
            quotationMaster.ShippingAddress = model.ShippingAddress;
            quotationMaster.QuotationRepresentative = model.QuotationRepresentative;
            quotationMaster.KindAttTo = model.KindAttTo;
            quotationMaster.ShippingAddressRemarks = model.ShippingAddressRemarks;
            quotationMaster.PartyName = model.PartyName;
            quotationMaster.ContactId = model.ContactId;
            quotationMaster.Terms = model.Terms;
            quotationMaster.Quotation_Updated_By = currentUser.CurrentUserId;
            quotationMaster.Quotation_DOU = DateTime.Now;
            quotationMaster.QuotationDate = model.QuotationDate;

            if (quotationMaster.QuotationDetails.Count > 1)
            {
                foreach (var item in quotationMaster.QuotationDetails)
                {
                    item.IsActive = false;
                }
            }

            model.QuotationDetails.ForEach(x =>
            {
                if (x.QuotationDetailsId != 0)
                {
                    var entity = _unitOfWork.QuotationDetails.FindAll().FirstOrDefault(y => y.QuotationDetailsId == x.QuotationDetailsId);
                    entity.SampleName = x.SampleName;
                    entity.ActualName = x.ActualName;
                    entity.Group = x.Group;
                    entity.QuantityId = x.QuantityId;
                    entity.QuantityMutiple = x.QuantityMutiple;
                    entity.Rate = x.Rate;
                    entity.GroupId = x.GroupId;
                    entity.ActualNameValue = x.ActualNameValue;
                    entity.IsActive = true;
                    entity.Quotation_DOU = DateTime.Now;
                    entity.QuotationDetails_Updated_By = currentUser.CurrentUserId;
                }
                else
                {
                    quotationMaster.QuotationDetails.Add(new QuotationDetails
                    {
                        SampleName = x.SampleName,
                        ActualName = x.ActualName,
                        Group = x.Group,
                        QuantityId = x.QuantityId,

                        QuantityMutiple = x.QuantityMutiple,
                        Rate = x.Rate,
                        GroupId = x.GroupId,
                        ActualNameValue = x.ActualNameValue,
                        IsActive = true,
                        Quotation_DOE = DateTime.Now,
                        QuotationDetails_Created_By = currentUser.CurrentUserId,
                    });
                }
            });

            _unitOfWork.Save();
            return new ResponseResults();
        }
    }
}
