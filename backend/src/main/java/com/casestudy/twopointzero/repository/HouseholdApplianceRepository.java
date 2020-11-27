package com.casestudy.twopointzero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.casestudy.twopointzero.model.HouseholdAppliance;

@Repository
public interface HouseholdApplianceRepository extends JpaRepository<HouseholdAppliance, Long> {
	
}