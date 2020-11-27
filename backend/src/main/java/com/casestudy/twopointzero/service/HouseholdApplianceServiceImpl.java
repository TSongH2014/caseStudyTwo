package com.casestudy.twopointzero.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.casestudy.twopointzero.model.HouseholdAppliance;
import com.casestudy.twopointzero.repository.HouseholdApplianceRepository;

@Service
public class HouseholdApplianceServiceImpl implements HouseholdApplianceService {

	private HouseholdApplianceRepository householdApplianceRepository;
	
	@Autowired
	public HouseholdApplianceServiceImpl(HouseholdApplianceRepository householdApplianceRepository) {
		this.householdApplianceRepository = householdApplianceRepository;
	}
	
	@Override
	public List<HouseholdAppliance> findAll() {
		return householdApplianceRepository.findAll();
	}
	
	@Override
	public Optional<HouseholdAppliance> findById(long theId) {
		return householdApplianceRepository.findById(theId);
	}

	@Override
	public HouseholdAppliance save(HouseholdAppliance theHouseholdAppliance) {
		return householdApplianceRepository.save(theHouseholdAppliance);
	}

	@Override
	public void deleteById(long theId) {
		householdApplianceRepository.deleteById(theId);
	}

}