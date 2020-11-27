package com.casestudy.twopointzero.service;

import java.util.List;
import java.util.Optional;

import com.casestudy.twopointzero.model.HouseholdAppliance;

public interface HouseholdApplianceService {

	public List<HouseholdAppliance> findAll();
	
	public Optional<HouseholdAppliance> findById(long theId);
	
	public HouseholdAppliance save(HouseholdAppliance theHouseholdAppliance);
	
	public void deleteById(long theId);
	
}