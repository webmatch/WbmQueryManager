<?php
/**
 * Query Manager
 * Copyright (c) Webmatch GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

namespace WbmQueryManager\Models;
use Doctrine\ORM\Mapping as ORM;
use Shopware\Components\Model\ModelEntity;
/**
 * @ORM\Entity
 * @ORM\Entity(repositoryClass="Repository")
 * @ORM\Table(name="wbm_query_manager")
 */
class Query extends ModelEntity
{
    /**
     * @var integer
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    private $name;

    /**
     * @var string
     * @ORM\Column(name="sql_string", type="string", nullable=false)
     */
    private $sqlString;

    /**
     * @var bool
     * @ORM\Column(name="has_cronjob", type="boolean", nullable=false)
     */
    private $hasCronjob = 0;

    /**
     * @var \DateTime $nextRun
     *
     * @ORM\Column(name="next_run", type="datetime", nullable=true)
     */
    private $nextRun;

    /**
     * @var \DateTime $lastRun
     *
     * @ORM\Column(name="last_run", type="datetime", nullable=true)
     */
    private $lastRun;

    /**
     * @var string $mailRecipient
     *
     * @ORM\Column(name="mail_recipient", type="string", nullable=true)
     */
    private $mailRecipient;

    /**
     * @var integer
     * @ORM\Column(name="interval_int", type="integer", nullable=true)
     */
    private $intervalInt = 0;

    /**
     * @var string
     * @ORM\Column(name="last_log", type="string", nullable=true)
     */
    private $lastLog;

    /**
     * @var bool
     * @ORM\Column(name="clear_cache", type="boolean", nullable=false)
     */
    private $clearCache = 0;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getSqlString()
    {
        return $this->sqlString;
    }

    /**
     * @param string $sqlString
     */
    public function setSqlString($sqlString)
    {
        $this->sqlString = $sqlString;
    }

    /**
     * @return boolean
     */
    public function isHasCronjob()
    {
        return $this->hasCronjob;
    }

    /**
     * @param boolean $hasCronjob
     */
    public function setHasCronjob($hasCronjob)
    {
        $this->hasCronjob = $hasCronjob;
    }

    /**
     * @return \DateTime
     */
    public function getNextRun()
    {
        return $this->nextRun;
    }

    /**
     * @param \DateTime $nextRun
     */
    public function setNextRun($nextRun)
    {
        $this->nextRun = $nextRun;
    }

    /**
     * @return \DateTime
     */
    public function getLastRun()
    {
        return $this->lastRun;
    }

    /**
     * @param \DateTime $lastRun
     */
    public function setLastRun($lastRun)
    {
        $this->lastRun = $lastRun;
    }

    /**
     * @return string
     */
    public function getMailRecipient()
    {
        return $this->mailRecipient;
    }

    /**
     * @param string $mailRecipient
     */
    public function setMailRecipient($mailRecipient)
    {
        $this->mailRecipient = $mailRecipient;
    }

    /**
     * @return int
     */
    public function getIntervalInt()
    {
        return $this->intervalInt;
    }

    /**
     * @param int $intervalInt
     */
    public function setIntervalInt($intervalInt)
    {
        $this->intervalInt = $intervalInt;
    }

    /**
     * @return string
     */
    public function getLastLog()
    {
        return $this->lastLog;
    }

    /**
     * @param string $lastLog
     */
    public function setLastLog($lastLog)
    {
        $this->lastLog = $lastLog;
    }

    /**
     * @return boolean
     */
    public function isClearCache()
    {
        return $this->clearCache;
    }

    /**
     * @param boolean $clearCache
     */
    public function setClearCache($clearCache)
    {
        $this->clearCache = $clearCache;
    }
}